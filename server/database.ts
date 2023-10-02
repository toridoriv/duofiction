import { DatabaseClient, Fanfictions } from "@deps";
import { mainLogger } from "./logger.ts";

const uri = Deno.env.get("MONGODB_URI") || "mongodb://localhost/duofictiondb";

export const databaseClient = new DatabaseClient(uri, {
  logger: mainLogger.getSubLogger({ namespace: "database" }),
}).registerCollection<Fanfictions.Fanfiction.output, "fanfictions">(
  "fanfictions",
);
