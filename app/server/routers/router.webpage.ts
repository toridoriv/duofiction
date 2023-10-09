import { express } from "@deps";
import { retrieveEndpoints } from "./router.utils.ts";

const WebpageRouter = express.Router();
const endpoints = await retrieveEndpoints("view");

endpoints.forEach((endpoint) => {
  WebpageRouter[endpoint.method](endpoint.path, ...endpoint.handlers);
});

export default WebpageRouter;
