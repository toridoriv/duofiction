import * as endpoint from "@endpoint";
import { Fanfictions, LanguageNameByCode, Status, z } from "@deps";

export let listLanguages = endpoint.init({
  method: "get",
  path: "/languages",
  resource: "languages",
  data: z.array(z.object({
    language: Fanfictions.Fanfiction.schema.shape.language,
    language_code: Fanfictions.Fanfiction.schema.shape.language_code,
    count: z.number().int(),
  })),
});

listLanguages = listLanguages.registerHandler(
  async function mainHandler(this: typeof listLanguages, _req, res, _next) {
    const languageCodes = await res.app.db.fanfictions.distinct(
      "language_code",
    );
    const languages = [] as z.output<typeof this["data"]>;

    for (let i = 0; i < languageCodes.length; i++) {
      const languageCode = languageCodes[i];
      const count = await res.app.db.fanfictions.countDocuments({
        language_code: languageCode,
      });

      languages.push({
        language: LanguageNameByCode[languageCode],
        language_code: languageCode,
        count,
      });
    }

    const response = this.getResponse(Status.OK).setData(languages);

    return res.status(response.status).json(response);
  },
);
