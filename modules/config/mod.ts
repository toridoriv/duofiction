import {
  EnvironmentSchema,
  PackageJsonSchema,
} from "@modules/config/schemas.ts";
import PackageJson from "../../package.json" assert { type: "json" };

const env = EnvironmentSchema.parse(Deno.env.toObject());

const packageJson = PackageJsonSchema.parse(PackageJson);

export default { ...env, ...packageJson };
