import {
  EndpointView,
  getLanguageTag,
  type LanguageCode,
  sortTagsAlphabetically,
  Tag,
} from "@common";
import { z } from "@deps";

const CatalogItemSchema = z.custom<Tag>();

export default EndpointView.init({
  method: "get",
  path: "/languages-catalog",
  view: "catalog-tags",
  context: z.object({
    tags: z.array(CatalogItemSchema),
  }),
}).registerHandler(async function main(_req, res) {
  async function formatLanguageTag(code: LanguageCode) {
    const total = await res.app.fanfics.countDocuments({ language_code: code });

    return getLanguageTag(code, total);
  }
  const uniqueLanguages = await res.app.fanfics.distinct("language_code");
  const languageTags = await Promise.all(
    uniqueLanguages.map(formatLanguageTag),
  );

  return this.renderOk(res, {
    tags: sortTagsAlphabetically(languageTags),
  });
});
