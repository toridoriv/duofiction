import { difference } from "$std/datetime/difference.ts";
import { defineMiddleware } from "@modules/server/mod.ts";

const inspectRequest = defineMiddleware(
  function inspectRequest(req, res, next) {
    req.id = globalThis.crypto.randomUUID();
    res.duration = 0.1;
    const start = new Date();
    res.on("finish", function handleFinish() {
      const end = new Date();
      res.duration = difference(start, end, { units: ["milliseconds"] })
        .milliseconds as number;

      res.app.logger.http(req, res);
    });

    next();
  },
  0,
);

const handleNotFound = defineMiddleware(
  function handleNotFound(req, res, _next) {
    return res.status(404).render("error-not-found", { path: req.url });
  },
  1,
);

export default [inspectRequest, handleNotFound];

declare global {
  namespace Express {
    interface Request {
      id: string;
    }
    interface Response {
      duration: number;
    }
  }
}
