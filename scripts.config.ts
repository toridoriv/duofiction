import type { DenonConfig } from "https://deno.land/x/denon@2.5.0/mod.ts";

const config: DenonConfig = {
  scripts: {
    start: {
      cmd: `deno run dev.ts`,
      desc: "Run my webserver",
      watch: true,
    },
  },
  allow: "all",
  unstable: true,
  watcher: {
    interval: 1_000,
    skip: ["**/.git/**", "**/bin/**"],
    paths: ["islands", "modules", "routes", "components"],
    exts: ["ts", "css", "mjs", "json", "webmanifest", "tsx"],
  },
};

export default config;
