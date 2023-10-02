import { init } from "@endpoint";
import { Status, z } from "@deps";

const notFound = init({
  path: "*",
  view: "not-found",
  context: z.object({
    path: z.string(),
  }),
});

export default notFound.registerHandler(
  function renderNotFound(this: typeof notFound, req, res, _next) {
    return this.renderNotOk(Status.NotFound, res, { path: req.originalUrl });
  },
);
