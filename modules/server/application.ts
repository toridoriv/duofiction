import { Expand, express, expressHandlebars } from "@modules/server/deps.ts";
import { createRouter } from "@modules/server/route.ts";
import { registerMiddlewares } from "@modules/server/middleware.ts";
import { createAssetsRouter } from "@modules/server/assets.ts";

export type StaticOptions = Expand<Parameters<(typeof express)["static"]>[1]>;

export function createApplication(settings: Server.Settings) {
  const { dir: _, ...routerOptions } = settings.routes;
  const { middlewares } = settings.manifest;
  const app = express();

  app.logger = settings.logger;
  app.engine(".hbs", expressHandlebars.engine({ extname: ".hbs" }));
  app.set("view engine", ".hbs");
  app.set("views", settings.views.dir);

  Object.assign(app.locals, settings.locals);

  registerMiddlewares(app, middlewares);
  app.use(createAssetsRouter(settings.statics.dir));

  const router = createRouter(settings.manifest.routes, routerOptions);

  app.use(router);

  registerMiddlewares(app, middlewares, true);

  return app;
}

declare global {
  namespace Server {
    interface Settings {
      routes: express.RouterOptions & {
        dir: string;
      };
      locals: express.Locals;
      logger: LoggerModule.Logger;
      views: {
        dir: string;
      };
      statics: StaticOptions & {
        dir: string;
      };
      manifest: Server.Manifest;
    }
  }

  namespace Express {
    interface Application {
      logger: LoggerModule.Logger;
    }
  }
}
