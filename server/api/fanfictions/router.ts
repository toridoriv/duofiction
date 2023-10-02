import { express } from "@deps";
import create from "./endpoints/create.ts";
import list from "./endpoints/list.ts";
import retrieve from "./endpoints/retrieve.ts";
import { listLanguages } from "./endpoints/related.ts";

const FanfictionsRouter = express.Router() as Express.Router;

FanfictionsRouter.$PATH = "/fanfictions";

FanfictionsRouter[create.method](create.path, ...create.handlers);
FanfictionsRouter[list.method](list.path, ...list.handlers);
FanfictionsRouter[listLanguages.method](
  listLanguages.path,
  ...listLanguages.handlers,
);
FanfictionsRouter[retrieve.method](retrieve.path, ...retrieve.handlers);

export default FanfictionsRouter;

declare global {
  namespace Express {
    interface Router {
      $PATH: string;
    }
  }
}
