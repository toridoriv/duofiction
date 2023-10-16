import { SafeAny } from "@modules/typings/mod.ts";
import { Client, ClientOptions } from "@modules/database/client.ts";
import { chai } from "@modules/database/dev-deps.ts";
import { Superhero, superheroes } from "@modules/database/__data__.ts";

export const expect = chai.expect;
export const should = chai.should;

export async function runStep(testFn: () => Promise<SafeAny>) {
  await new Promise((resolve) => setTimeout(resolve, 100)); // Wait before running the test
  await testFn();
  await new Promise((resolve) => setTimeout(resolve, 100)); // Wait after running the test
}

export function getDatabaseSetup() {
  const infoMessages = [] as SafeAny[][];
  const errorMessages = [] as SafeAny[][];

  const logger: ClientOptions["logger"] = {
    info(...args) {
      infoMessages.push(...args);
    },
    error(...args) {
      errorMessages.push(...args);
    },
  };

  const client = new Client("mongodb://localhost/test", { logger });

  return { client, infoMessages, errorMessages };
}

export async function getDatabaseWithDataSetup() {
  const { client: baseClient, ...rest } = getDatabaseSetup();
  const collectionName = "superheroes" as const;
  const client = baseClient.registerCollection<
    Superhero,
    typeof collectionName
  >(collectionName);

  await client.superheroes.insertMany(superheroes);

  return { client, ...rest };
}
