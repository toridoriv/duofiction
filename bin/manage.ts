import { CliffyCommand, walkSync } from "./deps.ts";

const ManageCommand = new CliffyCommand.Command()
  .name("manage")
  .description("Manage all available commands for this project.")
  .action(function () {
    this.showHelp();
  });

await registerCommands();

ManageCommand.parse(Deno.args);

async function registerCommands() {
  const commands = [] as CliffyCommand.Command[];
  const options = {
    maxDepth: 3,
    includeDirs: false,
    exts: [".ts"],
    skip: [/_/],
  };

  for (const entry of walkSync("./bin/commands", options)) {
    const path = entry.path.replace("bin/", "./");
    const { default: command } = await import(path);

    if (command instanceof CliffyCommand.Command) {
      ManageCommand.command(command.getName(), command);
    }
  }

  return commands;
}
