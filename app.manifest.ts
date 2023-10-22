import { default as $route0 } from "@routes/greet/[name].ts";
import { default as $route1 } from "@routes/api/fanfiction-attributes/index.ts";
import { default as $route2 } from "@routes/index.ts";
import { default as $middlewares0 } from "@routes/_middlewares.ts";
import { default as $middlewares1 } from "@routes/api/_middlewares.ts";

const manifest: Server.Manifest = {
  routes: {
    "@/greet/:name": $route0,
    "@/api/fanfiction-attributes/": $route1,
    "@/": $route2,
  },
  middlewares: {
    "@/": $middlewares0,
    "@/api/": $middlewares1,
  },
  baseUrl: import.meta.url,
}

export default manifest;