import type { express } from "@deps";

export function isFunction(value: unknown): value is CallableFunction {
  return typeof value === "function";
}

export function isMiddleware(
  value: unknown,
): value is Middleware {
  return typeof value === "function" && value.length >= 3 &&
    typeof (value as Middleware).priority === "number";
}

export type Middleware = express.RequestHandler & {
  priority: number;
};
