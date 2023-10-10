import { relative, type WalkOptions, walkSync } from "@deps";
import {
  EndpointApi,
  type EndpointApiSettings,
  EndpointView,
  type EndpointViewSettings,
} from "@common";

const ENDPOINT_CONSTRUCTOR = {
  api: isEndpointApi,
  view: isEndpointView,
};

interface EndpointConstructorMap {
  api: EndpointApi<Required<EndpointApiSettings>>;
  view: EndpointView<Required<EndpointViewSettings>>;
}

const ROOT_DIR = "./app";

const walkOptions: WalkOptions = {
  skip: [/core\//, /views\//],
  includeDirs: false,
  exts: [".ts"],
  match: [/\.endpoint|\.view/],
};

export async function retrieveEndpoints<
  K extends keyof typeof ENDPOINT_CONSTRUCTOR,
>(kind: K): Promise<EndpointConstructorMap[K][]> {
  const isValid = ENDPOINT_CONSTRUCTOR[kind];
  const endpoints = [];

  for (const entry of walkSync(ROOT_DIR, walkOptions)) {
    const path = getRelativePath(entry.path);
    const def = await getDefaultExport(path);

    if (isValid(def)) {
      endpoints.push(def);
    }
  }

  return endpoints as EndpointConstructorMap[K][];
}

function getRelativePath(path: string) {
  const currentFile = import.meta.url.replace(`file://${Deno.cwd()}/app/`, "");

  return relative(currentFile, `./${path}`);
}

async function getDefaultExport(path: string) {
  const value = await import(path);

  return value.default;
}

function isEndpointApi(
  value: unknown,
): value is EndpointApi<Required<EndpointApiSettings>> {
  return value instanceof EndpointApi;
}

function isEndpointView(
  value: unknown,
): value is EndpointView<Required<EndpointViewSettings>> {
  return value instanceof EndpointView;
}
