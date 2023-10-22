import { WalkOptions, walkSync } from "@modules/server/deps.ts";

export function getFilePaths(dir: string, options: WalkOptions) {
  const iter = walkSync(dir, options);

  return [...iter].map((f) => f.path);
}

export function toNamespacePath(path: string) {
  return `@${path}`;
}

export function toRelativePath(path: string) {
  return `./${path}`;
}

export function getHandlerPath(path: string, namespace: string) {
  let transformed = path.replace(namespace, "").replace("index.ts", "").replace(
    "_middlewares.ts",
    "",
  );

  transformed = transformed.replace(".ts", "");

  if (transformed.includes("[")) {
    transformed = transformed.replaceAll("[", ":").replaceAll("]", "");
  }

  return transformed;
}

export async function getDefaultImport(path: string) {
  const module = await import(path);

  return module.default;
}

export function isRouteHandler(
  value: unknown,
): value is Route.Handler | Route.Handler[] {
  if (Array.isArray(value)) {
    return value.every(isRouteHandler);
  }

  return isHappyRouteHandler(value) || isErrorRouteHandler(value);
}

export function isErrorRouteHandler(
  value: unknown,
): value is Route.ErrorHandler {
  if (typeof value !== "function") {
    return false;
  }

  return value.length === 4 || value.name.includes("NotFound");
}

export function isHappyRouteHandler(
  value: unknown,
): value is Route.HappyHandler {
  if (typeof value !== "function") {
    return false;
  }

  return value.length === 3 && !value.name.includes("NotFound");
}

export function isMiddlewareHandler(
  value: unknown,
): value is Middlewares.Middleware {
  return isHappyRouteHandler(value) &&
    typeof (value as Middlewares.Middleware)?.priority === "number";
}

export function isErrorMiddlewareHandler(
  value: unknown,
): value is Middlewares.ErrorMiddleware {
  return isErrorRouteHandler(value) &&
    typeof (value as Middlewares.ErrorMiddleware)?.priority === "number";
}
