import { CliffyCommand } from "@bin/deps.ts";
import {
  getDependencyFilePaths,
  removeOldLockFile,
  removePreviousCache,
  runDenoCache,
} from "@bin/commands/_utils.ts";

const LockCommand = new CliffyCommand.Command()
  .name("lock")
  .description("Generate the dependencies lock file.")
  .option(
    "-c --clean [clean:boolean]",
    "Use this option to remove all previous cache.",
    { default: false },
  )
  .action(function main(options) {
    removeOldLockFile();
    const paths = getDependencyFilePaths(false);

    if (options.clean) {
      removePreviousCache();
    }

    paths.forEach(runDenoCache.bind(null, true));

    console.info("✅ Lock file written!");
  });

if (import.meta.main) {
  LockCommand.parse(Deno.args);
}

export default LockCommand;
