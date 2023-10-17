import { Logger } from "@modules/logger/mod.ts";
import config from "@modules/config/mod.ts";

export const logger = Logger.create({
  mode: config.PRETTY_LOG ? "PRETTY" : "JSON",
  environment: config.ENVIRONMENT,
  application: config.NAME,
  version: config.VERSION,
  severity: config.ENVIRONMENT === "DEVELOPMENT"
    ? Logger.SeverityName.Debug
    : Logger.SeverityName.Informational,
});
