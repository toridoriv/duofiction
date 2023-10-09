import { difference, type express, expressHandlebars } from "@deps";
import {
  getAllAvailableTagsForFanfiction,
  TextOutput,
  TextWithTranslationsOutput,
} from "@common";

export function inspectRequest(
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

    res.app.logger.http(req, res);
  });

  next();
}

export const handlebars = expressHandlebars.create({
  extname: "hbs",
  helpers: {
    getTextToDisplay,
    getMainTranslation,
    getTags: getAllAvailableTagsForFanfiction,
  },
});

// export function handleError(
//   error: Error,
//   req: express.Request,
//   res: express.Response,
//   next: express.NextFunction,
// ) {}
export function getTextToDisplay(text: TextOutput | TextOutput[]) {
  if (typeof text === "undefined") {
    return;
  }

  if (Array.isArray(text)) {
    if (text.length === 0) {
      return;
    }

    return text[0].rich || text[0].raw;
  }

  return text.rich || text.raw;
}

export function getMainTranslation(localized: TextWithTranslationsOutput) {
  return localized.translations[0];
}

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
