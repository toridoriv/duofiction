import { ansicolors } from "@deps";
import type { Log } from "./log.ts";
import { cloneObject } from "./utils.ts";

export function pretty(template: string, log: Log) {
  const args = log.data ? log.data.map(inspectData).join("\n") : "";
  const stack = log["error.stack_trace"]
    ? log["error.stack_trace"].split(", ").map(prettifyStack).join("\n")
    : "";

  if (args) {
    template = template.replaceAll("{data}", `\n${args}`);
  }

  if (stack) {
    template = template.replaceAll("{error.stack_trace}", `\n${stack}`);
  }

  return substitute(template, log);
}

export function json(log: Log, options?: Deno.InspectOptions) {
  if (options) {
    return Deno.inspect(cloneObject(log), options);
  }

  return JSON.stringify(log, null, 2);
}

function substitute(
  value: string,
  // deno-lint-ignore no-explicit-any
  substitutions: Record<string, any>,
): string {
  const regex = /{(.+?)\}/g;

  return value.replace(regex, (match: string, _index: number) => {
    const key = match.replace("{", "").replace("}", "");
    const substitution = substitutions[key];

    return substitution ? substitution : match;
  });
}

function inspectData(value: unknown) {
  return Deno.inspect(value, { colors: true, depth: 10 });
}

function prettifyStack(value: string) {
  return ansicolors.yellow(`  • ${ansicolors.underline(value)}`);
}
