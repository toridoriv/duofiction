import { z } from "@deps";
import { Logger } from "@common";
import packageJson from "../../package.json" assert { type: "json" };

enum Environment {
  Development = "DEVELOPMENT",
  Production = "PRODUCTION",
}

const EnvironmentSchema = z.preprocess(
  (x) => (typeof x === "string" ? x.toUpperCase() : x),
  z.nativeEnum(Environment).default(Environment.Production),
);

const ServerConfigSchema = z.object({
  environment: EnvironmentSchema,
  port: z.coerce.number().int().default(3000),
  loggerSeverity: z.custom<
    (typeof Logger.Severity)[keyof typeof Logger.Severity]
  >(),
  loggerMode: z.enum(["pretty", "json"]),
  package: z.custom<typeof packageJson>().default(packageJson),
  dbUri: z.string().url(),
});

const environment = EnvironmentSchema.parse(Deno.env.get("ENVIRONMENT"));

const configurations = {
  [Environment.Development]: ServerConfigSchema.parse({
    environment: Environment.Development,
    port: Deno.env.get("PORT"),
    loggerSeverity: Logger.Severity.Debug,
    loggerMode: "pretty",
    dbUri: Deno.env.get("MONGODB_URI") || "mongodb://localhost",
  }),
  [Environment.Production]: ServerConfigSchema.parse({
    environment: Environment.Production,
    port: Deno.env.get("PORT"),
    loggerSeverity: Logger.Severity.Informational,
    loggerMode: "json",
    dbUri: Deno.env.get("MONGODB_URI"),
  }),
};

export default configurations[environment];
