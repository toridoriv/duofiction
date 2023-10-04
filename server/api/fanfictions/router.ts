import { express } from "@deps";
import create from "./endpoints/create.ts";
import list from "./endpoints/list.ts";
import retrieve from "./endpoints/retrieve.ts";
import * as update from "./endpoints/update/mod.ts";

const FanfictionsRouter = express.Router() as Express.Router;

FanfictionsRouter.$PATH = "/fanfictions";

FanfictionsRouter[create.method](create.path, ...create.handlers);

FanfictionsRouter[list.method](list.path, ...list.handlers);

FanfictionsRouter[update.titleTranslations.method](
  update.titleTranslations.path,
  ...update.titleTranslations.handlers,
);

FanfictionsRouter[update.chapterTitleTranslations.method](
  update.chapterTitleTranslations.path,
  ...update.chapterTitleTranslations.handlers,
);

FanfictionsRouter[update.chapterParagraphTranslations.method](
  update.chapterParagraphTranslations.path,
  ...update.chapterParagraphTranslations.handlers,
);

FanfictionsRouter[update.summaryTranslations.method](
  update.summaryTranslations.path,
  ...update.summaryTranslations.handlers,
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
