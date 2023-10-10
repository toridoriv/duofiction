import { difference, type express, expressHandlebars } from "@deps";
import { retrieveHelpers } from "./server.utils.ts";

export function inspectRequest(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
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
}

export const handlebars = expressHandlebars.create({
  extname: "hbs",
  helpers: await retrieveHelpers(),
});

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
