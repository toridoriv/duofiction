import type { DenonConfig } from "https://deno.land/x/denon@2.5.0/mod.ts";

const config: DenonConfig = {
  scripts: {
    start: {
      cmd: "duofiction.main.ts",
      desc: "Run my webserver",
      watch: true,
    },
  },
  allow: "all",
  unstable: true,
  watcher: {
    interval: 1_000,
    skip: ["**/.git/**", "**/bin/**"],
    paths: ["modules", "routes", "static", "duofiction.main.ts", "views"],
    exts: ["ts", "css", "mjs", "json", "webmanifest", "hbs"],
  },
};

export default config;
