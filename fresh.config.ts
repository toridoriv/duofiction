import { defineConfig } from "$fresh/server.ts";
import {
  logger,
  MainAbortController,
  shutdownApplication,
} from "@utils/mod.ts";

export default defineConfig({
  server: {
    port: 3000,
    signal: MainAbortController.signal,
    onListen(params) {
      logger.info(
        `Server listening on: http://${params.hostname}:${params.port}`,
      );
      Deno.addSignalListener("SIGTERM", shutdownApplication);
      Deno.addSignalListener("SIGINT", shutdownApplication);
    },
  },
});
