import {
  CliffyCommand,
  existsSync,
  type WalkOptions,
  walkSync,
} from "../deps.ts";
import { executeCommand } from "./_utils.ts";

const CacheCommand = new CliffyCommand.Command()
  .name("cache")
  .description("Cache all dependencies for this project.")
  .option("-d, --development [development:boolean]", "", { default: false })
  .action(function main(options) {
    const paths = getDependencyFiles(options.development);

    removePreviousCache();

    paths.forEach(cacheDependencies);

    console.info("✅ All dependencies were cached.");
  });

if (import.meta.main) {
  CacheCommand.parse(Deno.args);
}

export default CacheCommand;

function getDependencyFiles(isDevelopment: boolean) {
  const paths = [] as string[];
  const skip = [/node_modules/, new RegExp("mod.ts")];
  const opts: WalkOptions = {
    includeDirs: false,
    exts: [".ts"],
    match: [
      /deps\./,
      new RegExp(".d.ts"),
    ],
    skip,
  };

  if (!isDevelopment) {
    skip.push(/bin\//);
  } else {
    opts.exts?.push(".mjs");
    opts.match?.push(
      new RegExp("prettier.config.mjs"),
      new RegExp("scripts.config.ts"),
    );
  }

  for (const entry of walkSync("./", opts)) {
    paths.push(entry.path);
  }

  return paths;
}

function removePreviousCache() {
  const denoDir = getCacheFile();
  const nodeModulesDir = "./node_modules";

  if (existsSync(denoDir)) {
    console.info(`ℹ️  Deleting cache on ${denoDir}`);
    executeCommand("rm", { args: ["-rf", denoDir] });
  }

  if (existsSync(nodeModulesDir)) {
    console.info(`ℹ️  Deleting cache on ${nodeModulesDir}`);
    executeCommand("rm", { args: ["-rf", nodeModulesDir] });
  }
}

function cacheDependencies(path: string) {
  console.info(`ℹ️  Caching dependencies for ./${path}`);
  const output = executeCommand("deno", {
    args: ["cache", "--lock-write", path],
  });

  return output;
}

function getCacheFile() {
  const output = executeCommand("deno", { args: ["info", "--json"] });

  return JSON.parse(output).denoDir as string;
}
