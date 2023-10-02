import { Logger } from "@deps";
import { packageJson } from "./packageJson.ts";
import { ENVIRONMENT } from "@constants";

let inspectOptions: Deno.InspectOptions | undefined = undefined;

if (ENVIRONMENT === "DEVELOPMENT") {
  inspectOptions = {
    colors: true,
  };
}

export const mainLogger = new Logger({
  namespace: "duofiction",
  id: Deno.env.get("DENO_DEPLOYMENT_ID"),
  version: packageJson.version,
  application: packageJson.name,
  mode: Logger.Mode[ENVIRONMENT],
  inspectOptions,
});
