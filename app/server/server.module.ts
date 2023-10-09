import { express } from "@deps";
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

const application = express();

application.logger = createLogger({
  application: serverConfig.package.name,
  version: serverConfig.package.version,
  severity: serverConfig.loggerSeverity,
  environment: serverConfig.environment,
  mode: serverConfig.loggerMode,
});

const database = new DatabaseClient(serverConfig.dbUri, {
  logger: application.logger,
}).registerCollection<FanfictionDocumentOutput, "fanfictions">("fanfictions");

application.use(middleware.inspectRequest);
application.engine(".hbs", middleware.handlebars.engine);
application.set("view engine", ".hbs");
application.set("views", "./app/views");
application.use(AssetsRouter);
application.use(WebpageRouter);

const server = application.listen(serverConfig.port, handleListening);

server.on("close", handleClose);

Deno.addSignalListener("SIGTERM", handleKillSignal);
Deno.addSignalListener("SIGINT", handleKillSignal);

async function handleListening() {
  await database.connect();

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
  namespace Express {
    interface Application {
      fanfics: (typeof database)["fanfictions"];
      logger: Logger;
    }
  }
}
