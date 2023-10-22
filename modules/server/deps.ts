// @deno-types="npm:@types/express@4"
export { default as express } from "npm:express@4";
export type * as expressCore from "./express-serve-static-core.d.ts";
export * as expressHandlebars from "https://esm.sh/express-handlebars@7.1.2?keep-names?deno-std=0.204.0";

export { extname } from "$std/path/mod.ts";
export { Status } from "$std/http/mod.ts";
export { existsSync, type WalkOptions, walkSync } from "$std/fs/mod.ts";
export * from "@modules/typings/mod.ts";

// @deno-types="npm:@types/mustache"
export { default as Mustache } from "npm:mustache@4.2.0";
