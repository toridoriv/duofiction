import { express, minifier, Status } from "@deps";
import serverConfig from "../server.config.ts";

const AssetsRouter = express.Router();

export enum Asset {
  FaviconAndroid192 = "android-chrome-192x192.png",
  FaviconAndroid512 = "android-chrome-512x512.png",
  FaviconApple = "apple-touch-icon.png",
  FaviconIco = "favicon.ico",
  FaviconIco16 = "favicon-16x16.png",
  FaviconIco32 = "favicon-32x32.png",
  Manifest = "site.webmanifest",
  ScriptMain = "scripts/main.mjs",
  StyleMain = "styles/main.css",
  RobotsTxt = "robots.txt",
}

const PUBLIC_FILES_DIRECTORY = "./app/views/public";

export const ASSET_FILES = {
  [Asset.FaviconAndroid192]: Deno.readFileSync(
    `${PUBLIC_FILES_DIRECTORY}/assets/${Asset.FaviconAndroid192}`,
  ),
  [Asset.FaviconAndroid512]: Deno.readFileSync(
    `${PUBLIC_FILES_DIRECTORY}/assets/${Asset.FaviconAndroid512}`,
  ),
  [Asset.FaviconApple]: Deno.readFileSync(
    `${PUBLIC_FILES_DIRECTORY}/assets/${Asset.FaviconApple}`,
  ),
  [Asset.FaviconIco]: Deno.readFileSync(
    `${PUBLIC_FILES_DIRECTORY}/assets/${Asset.FaviconIco}`,
  ),
  [Asset.FaviconIco16]: Deno.readFileSync(
    `${PUBLIC_FILES_DIRECTORY}/assets/${Asset.FaviconIco16}`,
  ),
  [Asset.FaviconIco32]: Deno.readFileSync(
    `${PUBLIC_FILES_DIRECTORY}/assets/${Asset.FaviconIco32}`,
  ),
  [Asset.Manifest]: Deno.readTextFileSync(
    `${PUBLIC_FILES_DIRECTORY}/assets/${Asset.Manifest}`,
  ),
  [Asset.ScriptMain]: Deno.readTextFileSync(
    `${PUBLIC_FILES_DIRECTORY}/${Asset.ScriptMain}`,
  ),
  [Asset.StyleMain]: minifier.minify(
    minifier.Language.CSS,
    Deno.readTextFileSync(`${PUBLIC_FILES_DIRECTORY}/${Asset.StyleMain}`),
  ),
  [Asset.RobotsTxt]: Deno.readTextFileSync(
    `${PUBLIC_FILES_DIRECTORY}/assets/${Asset.RobotsTxt}`,
  ),
};

if (serverConfig.environment === "DEVELOPMENT") {
  ASSET_FILES[Asset.Manifest] = ASSET_FILES[Asset.Manifest].replace(
    serverConfig.package.homepage,
    `http://localhost:${serverConfig.port}`,
  );
}

const CONTENT_TYPE_BY_ASSET = {
  [Asset.FaviconAndroid192]: "image/png",
  [Asset.FaviconAndroid512]: "image/png",
  [Asset.FaviconApple]: "image/png",
  [Asset.FaviconIco]: "image/x-icon",
  [Asset.FaviconIco16]: "image/png",
  [Asset.FaviconIco32]: "image/png",
  [Asset.Manifest]: "application/json",
  [Asset.ScriptMain]: "application/javascript",
  [Asset.StyleMain]: "text/css",
  [Asset.RobotsTxt]: "text/plain",
};

function getHandler(
  asset: Asset,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction,
) {
  const contentType = CONTENT_TYPE_BY_ASSET[asset];
  const content = ASSET_FILES[asset];

  res.setHeader("content-type", contentType);

  if (typeof content === "string") {
    return res.status(Status.OK).send(content);
  }

  return res.status(Status.OK).end(content, "binary");
}

AssetsRouter.get(
  `/${Asset.FaviconAndroid192}`,
  getHandler.bind(AssetsRouter, Asset.FaviconAndroid192),
);

AssetsRouter.get(
  `/${Asset.FaviconAndroid512}`,
  getHandler.bind(AssetsRouter, Asset.FaviconAndroid512),
);

AssetsRouter.get(
  `/${Asset.FaviconApple}`,
  getHandler.bind(AssetsRouter, Asset.FaviconApple),
);

AssetsRouter.get(
  `/${Asset.FaviconIco}`,
  getHandler.bind(AssetsRouter, Asset.FaviconIco),
);

AssetsRouter.get(
  `/${Asset.FaviconIco16}`,
  getHandler.bind(AssetsRouter, Asset.FaviconIco16),
);

AssetsRouter.get(
  `/${Asset.FaviconIco32}`,
  getHandler.bind(AssetsRouter, Asset.FaviconIco32),
);

AssetsRouter.get(
  `/${Asset.Manifest}`,
  getHandler.bind(AssetsRouter, Asset.Manifest),
);

AssetsRouter.get(
  `/${Asset.ScriptMain}`,
  getHandler.bind(AssetsRouter, Asset.ScriptMain),
);

AssetsRouter.get(
  `/${Asset.StyleMain}`,
  getHandler.bind(AssetsRouter, Asset.StyleMain),
);

AssetsRouter.get(
  `/${Asset.RobotsTxt}`,
  getHandler.bind(AssetsRouter, Asset.RobotsTxt),
);

export default AssetsRouter;
