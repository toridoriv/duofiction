import { registerCommands } from "./commands/_utils.ts";
import { CliffyCommand } from "./deps.ts";

const ManageCommand = new CliffyCommand.Command()
  .name("manage")
  .description("Manage all available commands for this project.")
  .action(function () {
    this.showHelp();
  });

await registerCommands(ManageCommand, "./bin/commands", {
  maxDepth: 1,
  exts: [".ts"],
  skip: [/_/],
  includeDirs: false,
});

ManageCommand.parse(Deno.args);
