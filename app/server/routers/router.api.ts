import { express } from "@deps";
import { retrieveEndpoints } from "./router.utils.ts";

const ApiRouter = express.Router();
const endpoints = await retrieveEndpoints("api");

endpoints.forEach((endpoint) => {
  ApiRouter[endpoint.method](endpoint.path, ...endpoint.handlers);
});

export default ApiRouter;
