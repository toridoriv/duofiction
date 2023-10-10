import "https://deno.land/std@0.203.0/dotenv/load.ts";

import type { DenonConfig } from "@deps";

const config: DenonConfig = {
  scripts: {
    start: {
      cmd: `deno run --location ${Deno.env.get("LOCATION")} app/main.ts`,
      desc: "Run my webserver",
      watch: true,
    },
  },
  allow: "all",
  unstable: true,
  watcher: {
    interval: 1_000,
    skip: ["**/.git/**", "**/bin/**"],
    paths: ["app", "common"],
    exts: ["ts", "css", "mjs", "json", "webmanifest"],
  },
};

export default config;
