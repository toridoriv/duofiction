import { express } from "@deps";
import { relative, type WalkEntry, walkSync } from "@deps";
import { EndpointApi, EndpointApiSettings } from "@common";

const ApiRouter = express.Router();

for (
  const entry of walkSync("./app", {
    maxDepth: 10,
    skip: [/core\//, /views\//],
  })
) {
  if (isEndpointFile(entry)) {
    const currentFile = import.meta.url.replace(
      `file://${Deno.cwd()}/app/`,
      "",
    );
    const relativePath = relative(currentFile, "./" + entry.path);

    const { default: $endpoint } = await import(relativePath);

    if ($endpoint instanceof EndpointApi) {
      const endpoint = $endpoint as EndpointApi<EndpointApiSettings>;

      ApiRouter[endpoint.method](endpoint.path, ...endpoint.handlers);
    }
  }
}

function isEndpointFile(entry: WalkEntry) {
  return entry.isFile && entry.path.includes(".endpoint");
}

export default ApiRouter;
