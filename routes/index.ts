import { defineRouteHandlers } from "@modules/server/mod.ts";

export interface ApiHandlerOptions extends Route.HandlersOptions {
  resBody: string;
}

export default defineRouteHandlers<ApiHandlerOptions>()({
  get: function Home(_req, res, _next) {
    return res.status(200).render("home", { title: "Duofiction" });
  },
});
