import { express, Status } from "@deps";

const AssetsRouter = express.Router();

enum Asset {
  FaviconAndroid192 = "android-chrome-192x192.png",
  FaviconAndroid512 = "android-chrome-512x512.png",
  FaviconApple = "apple-touch-icon.png",
  FaviconIco = "favicon.ico",
  FaviconIco16 = "favicon-16x16.png",
  FaviconIco32 = "favicon-32x32.png",
  Manifest = "site.webmanifest",
}

const ASSET_FILES = {
  [Asset.FaviconAndroid192]: Deno.readFileSync(
    `./public/assets/${Asset.FaviconAndroid192}`,
  ),
  [Asset.FaviconAndroid512]: Deno.readFileSync(
    `./public/assets/${Asset.FaviconAndroid512}`,
  ),
  [Asset.FaviconApple]: Deno.readFileSync(
    `./public/assets/${Asset.FaviconApple}`,
  ),
  [Asset.FaviconIco]: Deno.readFileSync(
    `./public/assets/${Asset.FaviconIco}`,
  ),
  [Asset.FaviconIco16]: Deno.readFileSync(
    `./public/assets/${Asset.FaviconIco16}`,
  ),
  [Asset.FaviconIco32]: Deno.readFileSync(
    `./public/assets/${Asset.FaviconIco32}`,
  ),
  [Asset.Manifest]: Deno.readTextFileSync(`./public/assets/${Asset.Manifest}`),
};

const CONTENT_TYPE_BY_ASSET = {
  [Asset.FaviconAndroid192]: "image/png",
  [Asset.FaviconAndroid512]: "image/png",
  [Asset.FaviconApple]: "image/png",
  [Asset.FaviconIco]: "image/x-icon",
  [Asset.FaviconIco16]: "image/png",
  [Asset.FaviconIco32]: "image/png",
  [Asset.Manifest]: "application/json",
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

export default AssetsRouter;
