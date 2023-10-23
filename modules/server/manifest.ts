import { getHandlerPath } from "@modules/server/utils.ts";
import { getRoutesPaths } from "@modules/server/route.ts";
import { getMiddlewaresPaths } from "@modules/server/middleware.ts";
import { Mustache } from "@modules/server/deps.ts";

const TEMPLATE = Deno.readTextFileSync(
  "./modules/server/templates/server-manifest.mustache",
);

export function generateManifest(dir: string, filename: string) {
  const namespace = dir.startsWith("./") ? dir.replace("./", "@") : `@${dir}`;
  const routePaths = getRoutesPaths(dir);
  const middlewarePaths = getMiddlewaresPaths(dir);
  const imports: string[] = [];
  const routes: string[] = [];
  const middlewares: string[] = [];

  routePaths.forEach((path, i) => {
    const importName = `$route${i}`;
    const importLine = createImportLine(importName, path);
    const key = getHandlerPath(path, namespace);

    imports.push(importLine);
    routes.push(`"${key}": ${importName}`);
  });

  middlewarePaths.forEach((path, i) => {
    const importName = `$middlewares${i}`;
    const importLine = createImportLine(importName, path);
    const key = getHandlerPath(path, namespace);

    imports.push(importLine);
    middlewares.push(`"${key}": ${importName}`);
  });

  const fileContent = Mustache.render(TEMPLATE, {
    imports,
    routes,
    middlewares,
  });

  return Deno.writeTextFileSync(filename, fileContent);
}

function createImportLine(name: string, path: string) {
  return `import { default as ${name} } from "${path}";`;
}

declare global {
  namespace Server {
    interface Manifest {
      routes: Route.Mapping;
      middlewares: Middlewares.Mapping;
      baseUrl: string;
    }
  }
}
