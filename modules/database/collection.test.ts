import * as utils from "@modules/database/__utils__.ts";
import * as data from "@modules/database/__data__.ts";

Deno.test("Find a document in a collection", async (t) => {
  const { client } = await utils.getDatabaseWithDataSetup();

  await t.step("with id query", async () => {
    const expected = data.superheroes[0];
    const retrieved = await client.superheroes.findById(expected.id);

    utils.expect(retrieved).not.to.equal(null);
    utils.expect(retrieved?.id).to.equal(expected.id);
  });

  await t.step("with complex query", async () => {
    const marvelHeroes = await client.superheroes.find({ publisher: "Marvel" })
      .toArray();
    const withBlackHair = await client.superheroes.find({
      "appearance.hair_color": "Black",
    }).toArray();

    utils.expect(marvelHeroes.length).to.equal(2);
    utils.expect(withBlackHair.length).to.equal(2);
  });

  await t.step("with id query and projection", async () => {
    const expected = data.superheroes[0];
    const retrieved = await client.superheroes.findById(expected.id, {
      projection: { appearance: 0 },
    });

    // @ts-expect-error: Test only
    utils.expect(retrieved?.appearance).to.equal(undefined);
  });

  await t.step("with id query and nested projection", async () => {
    const expected = data.superheroes[0];
    const retrieved = await client.superheroes.findById(expected.id, {
      projection: { "appearance.gender": 0 },
    });

    utils.expect(retrieved?.appearance).to.be.an("object");
    // @ts-expect-error: Test only
    utils.expect(retrieved.appearance?.gender).to.equal(undefined);
  });

  await utils.runStep(() => client.superheroes.deleteMany({}));
  await utils.runStep(() => client.close());
});

Deno.test("Update a document", async (t) => {
  const { client } = await utils.getDatabaseWithDataSetup();
  const spiderman: data.Superhero = {
    id: globalThis.crypto.randomUUID(),
    name: "Spider-Man",
    publisher: "Marvel",
    biography: {
      full_name: "Peter Benjamin Parker",
      aliases: [],
    },
    appearance: {
      hair_color: "Brown",
      eye_color: "Hazel",
      gender: "Male",
      species: "Human",
    },
  };
  const { document: spidermanDocument } = await client.superheroes.insertOne(
    spiderman,
  );

  await t.step("with id query and projection", async () => {
    const updated = await client.superheroes.updateById(spiderman.id, {
      $push: { "biography.aliases": "Petey" },
    });

    utils.expect(updated?.updated_at).to.be.greaterThan(
      spidermanDocument.created_at,
    );
    utils.expect(updated?.biography.aliases).to.include("Petey");
  });

  await utils.runStep(() => client.superheroes.deleteMany({}));
  await utils.runStep(() => client.close());
});
