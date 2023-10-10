import { type express, getCookies } from "@deps";
import { Middleware } from "@common";
import {
  removeSessionCookie,
  retrieveSessionCookie,
  type SessionCookie,
} from "./login.services.ts";

export const setCookie = function setCookie(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  // @ts-ignore: ¯\_(ツ)_/¯
  const headers = new Headers(Object.entries(req.headers));
  const token = getCookies(headers)["session_token"];

  if (!token) {
    return next();
  }

  const currentSessionCookie = retrieveSessionCookie(token);

  if (!currentSessionCookie) {
    return next();
  }

  req.sessionCookie = currentSessionCookie;
  res.locals.isLoggedIn = true;

  return next();
} as Middleware;

setCookie.priority = 0;

export const deleteExpiredCookie = function deleteExpiredCookie(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  if (req.sessionCookie) {
    if (req.sessionCookie.isExpired()) {
      removeSessionCookie(req.sessionCookie.email);
      res.locals.isLoggedIn = false;
    }
  }

  return next();
} as Middleware;

deleteExpiredCookie.priority = 1;

declare global {
  namespace Express {
    interface Locals {
      isLoggedIn: boolean;
    }

    interface Request {
      sessionCookie?: SessionCookie;
    }
  }
}
