export { Database } from "@modules/database/mod.ts";

import { Database } from "@modules/database/mod.ts";
import config from "@modules/config/mod.ts";
import { logger } from "@utils/logger.ts";
import { FanfictionOutput } from "@modules/fanfiction/mod.ts";

export const client = new Database.Client(config.MONGODB_URI, {
  logger: logger.getSubLogger({ module: "database" }),
}).registerCollection<FanfictionOutput, "fanfictions">("fanfictions");

export const database = client.db();

if (!client.isConnected) {
  await client.connect();
}
