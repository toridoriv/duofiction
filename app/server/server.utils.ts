import { relative, type WalkOptions, walkSync } from "@deps";
import { isFunction, isMiddleware, type Middleware } from "@common";

const ROOT_DIR = "./app";

const walkHelperOptions: WalkOptions = {
  skip: [/server\//, /views\//],
  includeDirs: false,
  exts: [".ts"],
  match: [/\.helpers/],
};

const walkMiddlewareOptions: WalkOptions = {
  skip: [/server\//, /views\//],
  includeDirs: false,
  exts: [".ts"],
  match: [/\.middlewares\./],
};

export async function retrieveHelpers() {
  const helpers = [] as CallableFunction[];

  for (const entry of walkSync(ROOT_DIR, walkHelperOptions)) {
    const path = getRelativePath(entry.path);
    const namedExports = await getNamedExports(path);

    helpers.push(...namedExports.filter(isFunction));
  }

  return helpers.reduce((acc, prev) => {
    acc[prev.name] = prev;

    return acc;
  }, {} as Record<string, CallableFunction>);
}

export async function retrieveMiddlewares() {
  const middlewares = [] as Middleware[];

  for (const entry of walkSync(ROOT_DIR, walkMiddlewareOptions)) {
    const path = getRelativePath(entry.path);
    const namedExports = await getNamedExports(path);

    middlewares.push(...namedExports.filter(isMiddleware));
  }

  return middlewares.sort((a, b) => a.priority - b.priority);
}

function getRelativePath(path: string) {
  const currentFile = import.meta.url.replace(`file://${Deno.cwd()}/app/`, "");

  return relative(currentFile, `./${path}`);
}

async function getNamedExports(path: string) {
  const module = await import(path);

  return Object.values(module);
}
