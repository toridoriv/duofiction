import { express } from "@deps";
import { Controller, Handler } from "./controller.ts";

export function registerControllers(
  router: express.Router,
  endpoint: string,
  ...controllers: Controller<Handler>[]
) {
  controllers.forEach((controller) => {
    router[controller.method](
      endpoint + controller.path,
      ...controller.handlers,
    );
  });

  return router;
}
