import { express } from "@deps";
import home from "./views/home.ts";
import notFound from "./views/not-found.ts";
import tags from "./views/tags.ts";
import createFanfiction from "./views/create-fanfiction.ts";
import fanfiction from "./views/fanfiction.ts";

const WebRouter = express.Router({
  mergeParams: true,
});

WebRouter.get(home.path, ...home.handlers);
WebRouter.get(tags.path, ...tags.handlers);
WebRouter.get(fanfiction.path, ...fanfiction.handlers);
WebRouter.get(createFanfiction.path, ...createFanfiction.handlers);

WebRouter.get(notFound.path, ...notFound.handlers);

export default WebRouter;
