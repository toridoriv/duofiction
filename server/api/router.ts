import { express } from "@deps";
import FanfictionsRouter from "./fanfictions/router.ts";

const ApiRouter = express.Router() as Express.Router;

ApiRouter.$PATH = "/api";

ApiRouter.use(FanfictionsRouter.$PATH, FanfictionsRouter);

export default ApiRouter;
