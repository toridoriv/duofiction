import { express } from "@deps";
import { mainLogger } from "./logger.ts";
import * as middlewares from "./middlewares.ts";
import ApiRouter from "./api/router.ts";
import AssetsRouter from "./assets.ts";
import WebRouter from "./web/router.ts";
import { ENVIRONMENT, IS_PRODUCTION, IS_READONLY, PORT } from "@constants";

const application = express() as express.Express & Express.Application;

application.set("port", PORT);
application.set("environment", ENVIRONMENT);
application.set("is-production", IS_PRODUCTION);
application.set("is-readonly", IS_READONLY);

application.logger = mainLogger;

application.use(middlewares.requestInspectionMiddleware);
// application.use(middlewares.helmetMiddleware);

// Handle views
application.engine("handlebars", middlewares.viewsHandler.engine);
application.set("views", "./views");
application.set("view engine", "handlebars");

application.locals.title = "Duofiction";
application.locals.isReadonly = application.get("is-readonly");
application.locals.isNotReadonly = !application.get("is-readonly");

application.use(express.json({ limit: "200mb" }));

application.use(ApiRouter.$PATH, ApiRouter);
application.use(AssetsRouter);
application.use(WebRouter);

export default application;
