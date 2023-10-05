import { express } from "@deps";
import * as ctrl from "./controllers/mod.ts";

const FanfictionsRouter = express.Router() as Express.Router;

FanfictionsRouter.$PATH = "/fanfictions";

FanfictionsRouter[ctrl.create.method](
  ctrl.create.path,
  ...ctrl.create.handlers,
);

FanfictionsRouter[ctrl.retrieve.method](
  ctrl.retrieve.path,
  ...ctrl.retrieve.handlers,
);

FanfictionsRouter[ctrl.destroy.method](
  ctrl.destroy.path,
  ...ctrl.destroy.handlers,
);

FanfictionsRouter[ctrl.list.method](
  ctrl.list.path,
  ...ctrl.list.handlers,
);

FanfictionsRouter[ctrl.title.retrieve.method](
  ctrl.title.retrieve.path,
  ...ctrl.title.retrieve.handlers,
);

FanfictionsRouter[ctrl.title.update.method](
  ctrl.title.update.path,
  ...ctrl.title.update.handlers,
);

export default FanfictionsRouter;

declare global {
  namespace Express {
    interface Router {
      $PATH: string;
    }
  }
}
