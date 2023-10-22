import { Logger } from "@modules/logger/mod.ts";
import { CliffyCommand, WalkOptions, walkSync } from "../deps.ts";

export const logger = Logger.create({
  severity: "DEBUG",
  mode: "PRETTY",
  application: "@duofiction/bin",
  environment: "DEVELOPMENT",
});

export function executeCommand(main: string, options?: Deno.CommandOptions) {
  const command = new Deno.Command(main, options);
  const { code, stdout, stderr } = command.outputSync();

  if (code !== 0) {
    throw new Error(`There was an error executing the command ${main}.`, {
      cause: new TextDecoder().decode(stderr),
    });
  }

  return new TextDecoder().decode(stdout);
}

export async function registerCommands(
  mainCommand: CliffyCommand.Command,
  dir: string,
  options: WalkOptions,
) {
  const commands = [] as CliffyCommand.Command[];

  for (const entry of walkSync(dir, options)) {
    const path = `@${entry.path}`;
    const { default: command } = await import(path);

    if (command instanceof CliffyCommand.Command) {
      mainCommand.command(command.getName(), command);
    }
  }

  return commands;
}
