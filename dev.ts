import "https://deno.land/std@0.204.0/dotenv/load.ts";
import dev from "$fresh/dev.ts";
import config from "./fresh.config.ts";

await dev(import.meta.url, "./main.ts", config);
