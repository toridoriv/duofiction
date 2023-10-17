export { Database } from "@modules/database/mod.ts";

import { Database } from "@modules/database/mod.ts";
import config from "@modules/config/mod.ts";
import { logger } from "@utils/logger.ts";
import { FanfictionOutput } from "@modules/fanfiction/mod.ts";
import { MainAbortController } from "@utils/abort-signals.ts";

export const client = new Database.Client(config.MONGODB_URI, {
  logger: logger.getSubLogger({ module: "database" }),
}).registerCollection<FanfictionOutput, "fanfictions">("fanfictions");

export const database = client.db();

if (!client.isConnected) {
  await client.connect();
}

Deno.addSignalListener("SIGTERM", handleKillSignal);
Deno.addSignalListener("SIGINT", handleKillSignal);

async function handleKillSignal() {
  if (client.isConnected) {
    await client.close(false);
  }

  MainAbortController.abort("A kill signal has been received.");
  Deno.exit(0);
}
