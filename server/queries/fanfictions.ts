import { BSON, Fanfictions } from "@deps";
import type { FanfictionsCollection } from "./typings.ts";

/* -------------------------------------------------------------------------- */
/*                       Internal Constants and Classes                       */
/* -------------------------------------------------------------------------- */
// #region
// #endregion

/* -------------------------------------------------------------------------- */
/*                                   Public                                   */
/* -------------------------------------------------------------------------- */
// #region
export function getFanfictionById(collection: FanfictionsCollection, id: Id) {
  return collection.findOne({
    _id: parseId(id),
  });
}

export function addTitleTranslations(
  collection: FanfictionsCollection,
  id: Id,
  translations: Fanfictions.Text.input[],
) {
  return collection.updateOne(
    { _id: parseId(id) },
    {
      $push: { "title.translations": { $each: translations } },
    },
  );
}

export function addSummaryTranslations(
  collection: FanfictionsCollection,
  id: Id,
  translations: Fanfictions.Text.input[],
) {
  return collection.updateOne(
    { _id: parseId(id) },
    {
      $push: { "summary.translations": { $each: translations } },
    },
  );
}

export function addChapterTitleTranslations(
  collection: FanfictionsCollection,
  id: Id,
  { chapterIndex, translations }: UpdateChapterOptions,
) {
  const key = `chapters.${chapterIndex}.title.translations`;

  return collection.updateOne(
    { _id: parseId(id) },
    {
      $push: { [key]: { $each: translations } },
    },
  );
}

export function addChapterParagraphTranslations(
  collection: FanfictionsCollection,
  id: Id,
  {
    chapterIndex,
    translations,
    paragraphIndex,
  }: Required<UpdateChapterOptions>,
) {
  const key =
    `chapters.${chapterIndex}.paragraphs.${paragraphIndex}.translations`;

  return collection.updateOne(
    { _id: parseId(id) },
    {
      $push: { [key]: { $each: translations } },
    },
  );
}
// #endregion

/* -------------------------------------------------------------------------- */
/*                             Internal Functions                             */
/* -------------------------------------------------------------------------- */
// #region
function parseId(id: Id) {
  if (typeof id === "string") {
    return new BSON.UUID(id) as unknown as BSON.ObjectId;
  }

  return id as unknown as BSON.ObjectId;
}
// #endregion

/* -------------------------------------------------------------------------- */
/*                               Internal Types                               */
/* -------------------------------------------------------------------------- */
// #region
type Id = string | BSON.UUID;
type UpdateChapterOptions = {
  chapterIndex: number;
  paragraphIndex?: number;
  translations: Fanfictions.Text.input[];
};
// #endregion
