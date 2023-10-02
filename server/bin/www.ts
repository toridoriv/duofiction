import https from "node:https";
import application from "../application.ts";
import { databaseClient } from "../database.ts";

application.db = databaseClient;

const options: https.ServerOptions = {};
const isProduction = application.get("is-production");
const port = application.get("port");

if (!isProduction) {
  options.key = Deno.readTextFileSync("./duofiction.key");
  options.cert = Deno.readTextFileSync("./duofiction.chained.crt");
}

const server = https.createServer(options, application);

server.on("close", handleClose);

Deno.addSignalListener("SIGTERM", handleKillSignal);
Deno.addSignalListener("SIGINT", handleKillSignal);

server.listen(port, handleListening);

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
