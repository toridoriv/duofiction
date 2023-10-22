import { express, extname, Status } from "@modules/server/deps.ts";
import {
  getFilePaths,
  getHandlerPath,
  toRelativePath,
} from "@modules/server/utils.ts";

const CONTENT_TYPE_BY_FILE_EXTENSION = {
  ".png": "image/png",
  ".ico": "image/png",
  ".webmanifest": "application/json",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".txt": "text/plain",
};

const ONE_MONTH = 30 * 24 * 60 * 60;

export function createAssetsRouter(dir: string) {
  const router = express.Router();
  const assets = getFilePaths(dir, { includeDirs: false }).map(toRelativePath)
    .map(toHandlerOptions.bind(null, dir));

  assets.forEach((asset) => {
    router.get(asset.path, asset.handler);
  });

  return router;
}

function toHandlerOptions(dir: string, path: string) {
  const content = Deno.readFileSync(path);
  const ext = getFileExtension(path);

  return { path: getHandlerPath(path, dir), handler: getHandler(ext, content) };
}

function getHandler(
  ext: keyof typeof CONTENT_TYPE_BY_FILE_EXTENSION,
  content: Uint8Array,
) {
  return function getAsset(
    _req: Route.Request,
    res: Route.Response,
    _next: express.NextFunction,
  ) {
    const contentType = CONTENT_TYPE_BY_FILE_EXTENSION[ext];

    res.setHeader("content-type", contentType);
    res.setHeader("cache-control", "max-age=" + ONE_MONTH + ", immutable");

    return res.status(Status.OK).end(content, "binary");
  };
}

function getFileExtension(path: string) {
  return extname(path) as keyof typeof CONTENT_TYPE_BY_FILE_EXTENSION;
}
