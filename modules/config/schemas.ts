import { z } from "@modules/config/deps.ts";

const UrlSchema = z.string().url();
const EmailSchema = z.string().email();
const NotEmptyStringSchema = z.string().min(1);

export const EnvironmentSchema = z.object({
  ENVIRONMENT: z
    .preprocess(toUpperCase, z.enum(["DEVELOPMENT", "PRODUCTION"]))
    .default("PRODUCTION"),
  PORT: z.coerce.number().int().min(1000).default(3000),
  MONGODB_URI: UrlSchema.default("mongodb://localhost"),
  ADMIN_EMAILS: z.preprocess(split, z.array(EmailSchema)),
  ADMIN_PASSWORDS: z.preprocess(split, z.array(NotEmptyStringSchema)),
  PRETTY_LOG: z.coerce.boolean().default(false),
});

export const PackageJsonSchema = z
  .object({
    name: z.string().min(1),
    version: z.string().min(5),
    homepage: UrlSchema,
    config: z.object({
      title: NotEmptyStringSchema,
    }),
  })
  .transform(toUpperCaseKeys);

function toUpperCase<T>(value: T) {
  if (typeof value === "string") {
    return value.toUpperCase();
  }

  return value;
}

function split<T>(value: T) {
  if (typeof value === "string") {
    return value.split(",");
  }

  return value;
}

function toUpperCaseKeys(value: {
  name: string;
  version: string;
  homepage: string;
  config: { title: string };
}) {
  return {
    NAME: value.name,
    VERSION: value.version,
    HOMEPAGE: value.homepage,
    TITLE: value.config.title,
  };
}
