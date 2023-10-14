export * from "@modules/logger/settings.ts";

import { Mode, SettingsInput } from "@modules/logger/settings.ts";
import { JsonLogger, PrettyLogger } from "@modules/logger/base.ts";

export type Settings = SettingsInput;

export function create(settings: Settings) {
  return settings.mode === Mode.Pretty
    ? new PrettyLogger(settings)
    : new JsonLogger(settings);
}
