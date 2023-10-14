// export * from "@common/deps.ts";
// export * from "@common/utility-types.ts";
// export * as cliffyCommand from "cliffy/command/mod.ts";
// export type { DenonConfig } from "denon";
// export type { Config as PrettierConfig } from "prettier";
export * as CliffyCommand from "https://deno.land/x/cliffy@v1.0.0-rc.3/command/mod.ts";
export {
  existsSync,
  type WalkOptions,
  walkSync,
} from "https://deno.land/std@0.204.0/fs/mod.ts";
export {
  dirname,
  relative,
  resolve,
} from "https://deno.land/std@0.204.0/path/mod.ts";
