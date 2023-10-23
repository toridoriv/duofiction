import { Logger } from "@modules/logger/mod.ts";
import { CliffyCommand, existsSync, WalkOptions, walkSync } from "@bin/deps.ts";

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

export function getDependencyFilePaths(isDevelopment: boolean) {
  const match: RegExp[] = [
    /deps\./,
    /modules\/.*\.d\.ts/,
  ];
  const skip: RegExp[] = [/node_modules/, /deno\/npm\/registry/];

  if (isDevelopment) {
    match.push(/prettier\.config/, /scripts\.config/);
  } else {
    skip.push(/bin\//);
  }

  const options: WalkOptions = {
    includeDirs: false,
    exts: [".ts"],
    match,
    skip,
  };

  return [...walkSync("./", options)].map((e) => e.path);
}

export function runDenoCache(writeLock: boolean, path: string) {
  logger.info(`ℹ️  Caching dependencies for ./${path}`);
  const args = ["cache"];

  if (writeLock) {
    args.push("--lock=deno.lock");
  }

  args.push(path);

  const output = executeCommand("deno", {
    args,
  });

  return output;
}

export function removePreviousCache() {
  const denoDir = getDenoDirPath();
  const nodeModulesDir = "./node_modules";

  if (existsSync(denoDir)) {
    logger.info(`ℹ️  Deleting cache on ${denoDir}`);
    executeCommand("rm", { args: ["-rf", denoDir] });
  }

  if (existsSync(nodeModulesDir)) {
    logger.info(`ℹ️  Deleting cache on ${nodeModulesDir}`);
    executeCommand("rm", { args: ["-rf", nodeModulesDir] });
  }
}

export function getDenoDirPath() {
  const output = executeCommand("deno", { args: ["info", "--json"] });

  return JSON.parse(output).denoDir as string;
}

export function removeOldLockFile() {
  logger.info(`ℹ️  Deleting deno.lock file...`);

  executeCommand("rm", { args: ["./deno.lock"] });
}
