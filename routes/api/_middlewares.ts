import { defineMiddleware } from "@modules/server/mod.ts";

const handleNotFound = defineMiddleware(
  function handleNotFound(req, res, _next) {
    res.app.logger.debug("Handling not found error...");
    return res.status(404).json({ notFound: req.url });
  },
  0,
);

export default [handleNotFound];
