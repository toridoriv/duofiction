import application from "../application.ts";
import { databaseClient } from "../database.ts";

application.db = databaseClient;

const port = application.get("port");

const server = application.listen(port, handleListening);

server.on("close", handleClose);

Deno.addSignalListener("SIGTERM", handleKillSignal);
Deno.addSignalListener("SIGINT", handleKillSignal);

async function handleListening() {
  await databaseClient.connect();

  application.logger.info(`Listening on port ${application.get("port")}.`);
}

async function handleClose() {
  await databaseClient.close(false);
  // MongoStore.emit("close");

  application.logger.info("Shutting down application.");
}

async function handleKillSignal() {
  console.log();

  await server.close();
}
