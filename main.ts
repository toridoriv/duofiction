import "$std/dotenv/load.ts";

import * as serverModule from "@modules/server/mod.ts";
import { Logger } from "@modules/logger/mod.ts";
import config from "@modules/config/mod.ts";
import manifest from "./app.manifest.ts";

const NAVBAR_LINKS = [
  { text: "🏠 Home", href: "/" },
  { text: "📚 Catalog", href: "/catalog/pages/1" },
  { text: "🏷️ Tags", href: "/tags" },
  { text: "🌐 Languages", href: "/languages" },
];

const STYLESHEETS = [
  "https://cdn.jsdelivr.net/npm/halfmoon@2.0.1/css/halfmoon.min.css",
  "https://cdn.jsdelivr.net/npm/victormono@latest/dist/index.min.css",
  "/styles/main.css",
];

const logger = Logger.create({
  severity: config.ENVIRONMENT === "DEVELOPMENT"
    ? Logger.SeverityName.Debug
    : Logger.SeverityName.Informational,
  application: config.NAME,
  environment: config.ENVIRONMENT,
  mode: config.ENVIRONMENT === "DEVELOPMENT"
    ? Logger.Mode.Pretty
    : Logger.Mode.Json,
});

const application = serverModule.createApplication({
  routes: { dir: "./routes", mergeParams: true, caseSensitive: false },
  logger,
  views: {
    dir: "./views",
  },
  locals: {
    title: config.TITLE,
    isProduction: config.ENVIRONMENT === "PRODUCTION",
    stylesheets: STYLESHEETS,
    navLinks: NAVBAR_LINKS,
  },
  statics: {
    dir: "./static",
    maxAge: 3_600_00,
    immutable: true,
  },
  manifest,
});

const server = application.listen(config.PORT, handleListening);

// server.on("")

function handleListening() {
  logger.info("listening");
}

server.on("close", handleClose);

Deno.addSignalListener("SIGTERM", handleKillSignal);
Deno.addSignalListener("SIGINT", handleKillSignal);

function handleClose() {
  application.logger.info("Shutting down application.");
}

async function handleKillSignal() {
  console.log();

  await server.close();
}

declare global {
  namespace Express {
    interface Locals {
      title: string;
      isProduction: boolean;
      stylesheets: string[];
      navLinks: { text: string; href: string }[];
    }
  }
}
