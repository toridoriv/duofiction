import { create, difference, express, helmet } from "@deps";
import { mainLogger } from "./logger.ts";
import * as helpers from "./web/helpers/mod.ts";

const requestsLogger = mainLogger.getSubLogger({ namespace: "requests" });

export function requestInspectionMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  req.id = globalThis.crypto.randomUUID();

  const start = new Date();

  res.on("finish", function handleFinish() {
    const end = new Date();
    res.duration = difference(start, end, { units: ["milliseconds"] })
      .milliseconds as number;

    requestsLogger.http(req, res);
  });

  next();
}

export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    // directives: {
    //   "script-src": ["'self'", "cdn.jsdelivr.net"],
    //   "style-src": ["self"],
    // },
  },
});

export const viewsHandler = create({
  helpers,
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
