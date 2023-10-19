import { logger } from "@utils/logger.ts";
import { client } from "@utils/database.ts";

export const MainAbortController = new AbortController();

MainAbortController.signal.addEventListener("abort", shutdownApplication);

export async function shutdownApplication() {
  logger.info("Shutting down the application...");
  await client.close();
  Deno.exit(0);
}
