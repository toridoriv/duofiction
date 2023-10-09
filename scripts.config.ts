import type { DenonConfig } from "@deps";

const config: DenonConfig = {
  scripts: {
    start: {
      cmd: "app/main.ts",
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
