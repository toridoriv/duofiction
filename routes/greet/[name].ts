import { defineRouteHandlers } from "@modules/server/mod.ts";

export interface GreetHandlerOptions extends Route.HandlersOptions {
  params: { name: string };
}

export default defineRouteHandlers<GreetHandlerOptions>()({
  get: function greet(req, res, _next) {
    return res.status(200).render("home", {
      name: req.params.name,
      subtitle: "Greet",
    });
  },
});
