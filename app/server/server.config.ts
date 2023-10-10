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

const ServerConfigSchema = z
  .object({
    environment: EnvironmentSchema,
    port: z.coerce.number().int().default(3000),
    loggerSeverity: z.custom<
      (typeof Logger.Severity)[keyof typeof Logger.Severity]
    >(),
    loggerMode: z.enum(["pretty", "json"]),
    package: z.custom<typeof packageJson>().default(packageJson),
    dbUri: z.string().url(),
    sessionExpiresIn: z.number().int().default(180_000),
    location: z.string().url(),
    domain: z.string().default(""),
    adminEmails: z.array(z.string().email()),
    adminPasswords: z.array(z.string().min(6)),
  })
  .transform((config) => {
    if (!config.domain) {
      config.domain = new URL(config.location).hostname;
    }

    return config;
  });

const environment = EnvironmentSchema.parse(Deno.env.get("ENVIRONMENT"));

const configurations = {
  [Environment.Development]: ServerConfigSchema.parse({
    environment: Environment.Development,
    port: Deno.env.get("PORT"),
    loggerSeverity: Logger.Severity.Debug,
    loggerMode: "pretty",
    dbUri: Deno.env.get("MONGODB_URI") || "mongodb://localhost",
    location: Deno.env.get("LOCATION"),
    adminEmails: Deno.env.get("ADMIN_EMAILS")?.split(","),
    adminPasswords: Deno.env.get("ADMIN_PASSWORDS")?.split(","),
  }),
  [Environment.Production]: ServerConfigSchema.parse({
    environment: Environment.Production,
    port: Deno.env.get("PORT"),
    loggerSeverity: Logger.Severity.Informational,
    loggerMode: "json",
    dbUri: Deno.env.get("MONGODB_URI"),
    location: Deno.env.get("LOCATION"),
    adminEmails: Deno.env.get("ADMIN_EMAILS")?.split(","),
    adminPasswords: Deno.env.get("ADMIN_PASSWORDS")?.split(","),
  }),
};

export default configurations[environment];
