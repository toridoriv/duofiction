import { CliffyCommand } from "@bin/deps.ts";
import {
  getDependencyFilePaths,
  logger,
  removePreviousCache,
  runDenoCache,
} from "@bin/commands/_utils.ts";

const CacheCommand = new CliffyCommand.Command()
  .name("cache")
  .description("Cache all dependencies for this project.")
  .option(
    "-d, --development [development:boolean]",
    "Include development dependencies.",
    { default: false },
  )
  .option(
    "-c --clean [clean:boolean]",
    "Use this option to remove all previous cache.",
    { default: false },
  )
  .action(function main(options) {
    const paths = getDependencyFilePaths(options.development);

    if (options.clean) {
      removePreviousCache();
    }

    paths.forEach(runDenoCache.bind(null, options.development));

    logger.info("✅ All dependencies were cached.");
  });

if (import.meta.main) {
  CacheCommand.parse(Deno.args);
}

export default CacheCommand;
