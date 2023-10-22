import { CliffyCommand } from "../deps.ts";
import { registerCommands } from "./_utils.ts";

const GenerateCommand = new CliffyCommand.Command()
  .name("generate")
  .description("Generate data for the project.")
  .action(function () {
    this.showHelp();
  });

await registerCommands(GenerateCommand, "./bin/commands/generate", {
  maxDepth: 1,
  exts: [".ts"],
  skip: [/_/],
  includeDirs: false,
});

if (import.meta.main) {
  GenerateCommand.parse(Deno.args);
}

export default GenerateCommand;
