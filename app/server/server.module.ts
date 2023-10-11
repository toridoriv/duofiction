import { express, type mongodb } from "@deps";
import {
  createLogger,
  DatabaseClient,
  type FanfictionDocumentOutput,
  type Logger,
} from "@common";
import serverConfig from "./server.config.ts";
import * as middleware from "./server.middlewares.ts";
import AssetsRouter from "./routers/router.assets.ts";
import WebpageRouter from "./routers/router.webpage.ts";
import ApiRouter from "./routers/router.api.ts";
import { retrieveMiddlewares } from "./server.utils.ts";

const application = express();

application.logger = createLogger({
  application: serverConfig.package.name,
  version: serverConfig.package.version,
  severity: serverConfig.loggerSeverity,
  environment: serverConfig.environment,
  mode: serverConfig.loggerMode,
  inspectOptions: {
    colors: true,
    showHidden: true,
    showProxy: true,
    getters: true,
  },
});

const database = new DatabaseClient(serverConfig.dbUri, {
  logger: application.logger,
}).registerCollection<FanfictionDocumentOutput, "fanfictions">("fanfictions");

application.use(middleware.inspectRequest);
application.use(...(await retrieveMiddlewares()));

application.disable("x-powered-by");
application.engine(".hbs", middleware.handlebars.engine);
application.set("view engine", ".hbs");
application.set("views", "./app/views");

application.locals.title = "Duofiction";
application.locals.config = serverConfig;

application.use(express.urlencoded({ extended: true }));
application.use(express.json());
application.use(AssetsRouter);
application.use(WebpageRouter);
application.use("/api", ApiRouter);
application.use(middleware.handleNotFound);

await database.connect();

const server = application.listen(serverConfig.port, handleListening);

server.on("close", handleClose);

Deno.addSignalListener("SIGTERM", handleKillSignal);
Deno.addSignalListener("SIGINT", handleKillSignal);

function handleListening() {
  application.fanfics = database.fanfictions;
  application.logger.info(`Listening on port ${serverConfig.port}.`);
}

async function handleClose() {
  await database.close(false);

  application.logger.info("Shutting down application.");
}

async function handleKillSignal() {
  console.log();

  await server.close();
}

declare global {
  namespace Application {
    type FanfictionsCollection = mongodb.Collection<FanfictionDocumentOutput>;

    type FindFanfictionOptions = mongodb.FindOptions<FanfictionDocumentOutput>;
  }

  namespace Express {
    interface Application {
      fanfics: (typeof database)["fanfictions"];
      logger: Logger;
    }

    interface Locals {
      config: typeof serverConfig;
    }
  }
}
