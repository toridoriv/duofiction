import { defineConfig } from "$fresh/server.ts";
import { MainAbortController } from "@utils/mod.ts";

export default defineConfig({
  server: {
    port: 3000,
    signal: MainAbortController.signal,
  },
});
