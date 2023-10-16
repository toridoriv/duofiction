import * as data from "@modules/database/__data__.ts";
import * as utils from "@modules/database/__utils__.ts";
import { createDocument } from "@modules/database/document.ts";
import { mongodb } from "@modules/database/deps.ts";

Deno.test("Create a database document", async (t) => {
  const sampleData = data.superheroes[0];
  const sampleDocument = createDocument(sampleData);

  await t.step(
    "it should add an UUID to _id based on original id property",
    () => {
      utils.expect(sampleDocument._id).to.be.instanceof(mongodb.UUID);
      utils.expect(sampleDocument._id.toString()).to.equal(sampleDocument.id);
    },
  );

  await t.step("it should have added timestamps to original data", () => {
    utils.expect(sampleDocument.created_at).to.be.instanceof(Date);
    utils.expect(sampleDocument.updated_at).to.be.instanceof(Date);
  });

  await t.step("it should have maintained the original data", () => {
    Object.keys(sampleData).forEach((k) => {
      const key = k as keyof typeof sampleData;

      utils.expect(sampleDocument[key]).to.equal(sampleData[key]);
    });
  });
});
