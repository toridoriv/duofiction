import { Superhero } from "@modules/database/__data__.ts";
import * as utils from "@modules/database/__utils__.ts";

Deno.test("Handlers on open event of DatabaseClient", async () => {
  const { client, infoMessages } = utils.getDatabaseSetup();

  await utils.runStep(() => client.connect());
  utils.expect(infoMessages[0]).to.equal("Connected to the database.");
  await utils.runStep(() => client.close());
});

Deno.test("Handlers on close event of DatabaseClient", async () => {
  const { client, infoMessages } = utils.getDatabaseSetup();

  await utils.runStep(() => client.connect());
  await utils.runStep(() => client.close());

  utils.expect(infoMessages[1]).to.equal("Disconnected from the database.");
  utils.expect(infoMessages.length).to.equal(2);
});

Deno.test("Register a collection on DatabaseClient", async () => {
  const { client: baseClient } = utils.getDatabaseSetup();
  const collectionName = "superheroes" as const;
  const client = baseClient.registerCollection<
    Superhero,
    typeof collectionName
  >(collectionName);

  await utils.runStep(() => client.connect());
  const collection = client.superheroes;

  utils.expect(collection.collectionName).to.equal(collectionName);

  await utils.runStep(() => client.close());
});
