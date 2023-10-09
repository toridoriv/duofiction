import { z } from "@deps";

/**
 * An object mapping language names to their `ISO 639-1` language codes.
 *
 * This is a read-only object that contains mappings for many common languages.
 * The keys are the language names and the values are the corresponding
 * `ISO 639-1` language code.
 *
 * This can be used to look up the language code for a given language name.
 *
 * @example
 *
 * ```typescript
 * console.log(LANGUAGE_CODE["English"]); // "en"
 * console.log(LANGUAGE_CODE["Japanese"]); // "ja"
 * ```
 */
export const LANGUAGE_CODE = Object.freeze({
  "Afar": "aa",
  "Abkhazian": "ab",
  "Avestan": "ae",
  "Afrikaans": "af",
  "Akan": "ak",
  "Amharic": "am",
  "Aragonese": "an",
  "Arabic": "ar",
  "Assamese": "as",
  "Avaric": "av",
  "Aymara": "ay",
  "Azerbaijani": "az",
  "Bashkir": "ba",
  "Belarusian": "be",
  "Bulgarian": "bg",
  "Bislama": "bi",
  "Bambara": "bm",
  "Bengali": "bn",
  "Tibetan": "bo",
  "Breton": "br",
  "Bosnian": "bs",
  "Catalan": "ca",
  "Chechen": "ce",
  "Chamorro": "ch",
  "Corsican": "co",
  "Cree": "cr",
  "Czech": "cs",
  "Church Slavonic": "cu",
  "Chuvash": "cv",
  "Welsh": "cy",
  "Danish": "da",
  "German": "de",
  "Divehi": "dv",
  "Dzongkha": "dz",
  "Ewe": "ee",
  "Greek": "el",
  "English": "en",
  "Esperanto": "eo",
  "Spanish": "es",
  "Estonian": "et",
  "Basque": "eu",
  "Persian": "fa",
  "Fulah": "ff",
  "Finnish": "fi",
  "Fijian": "fj",
  "Faroese": "fo",
  "French": "fr",
  "Western Frisian": "fy",
  "Irish": "ga",
  "Gaelic": "gd",
  "Galician": "gl",
  "Guaraní": "gn",
  "Gujarati": "gu",
  "Manx": "gv",
  "Hausa": "ha",
  "Hebrew": "he",
  "Hindi": "hi",
  "Hiri Motu": "ho",
  "Croatian": "hr",
  "Haitian": "ht",
  "Hungarian": "hu",
  "Armenian": "hy",
  "Herero": "hz",
  "Interlingua": "ia",
  "Indonesian": "id",
  "Interlingue": "ie",
  "Igbo": "ig",
  "Sichuan Yi": "ii",
  "Inupiaq": "ik",
  "Ido": "io",
  "Icelandic": "is",
  "Italian": "it",
  "Inuktitut": "iu",
  "Japanese": "ja",
  "Javanese": "jv",
  "Georgian": "ka",
  "Kongo": "kg",
  "Kikuyu": "ki",
  "Kuanyama": "kj",
  "Kazakh": "kk",
  "Kalaallisut": "kl",
  "Central Khmer": "km",
  "Kannada": "kn",
  "Korean": "ko",
  "Kanuri": "kr",
  "Kashmiri": "ks",
  "Kurdish": "ku",
  "Komi": "kv",
  "Cornish": "kw",
  "Kirghiz": "ky",
  "Latin": "la",
  "Luxembourgish": "lb",
  "Ganda": "lg",
  "Limburgan": "li",
  "Lingala": "ln",
  "Lao": "lo",
  "Lithuanian": "lt",
  "Luba-Katanga": "lu",
  "Latvian": "lv",
  "Malagasy": "mg",
  "Marshallese": "mh",
  "Maori": "mi",
  "Macedonian": "mk",
  "Malayalam": "ml",
  "Mongolian": "mn",
  "Marathi": "mr",
  "Malay": "ms",
  "Maltese": "mt",
  "Burmese": "my",
  "Nauru": "na",
  "Norwegian Bokmål": "nb",
  "North Ndebele": "nd",
  "Nepali": "ne",
  "Ndonga": "ng",
  "Dutch": "nl",
  "Norwegian Nynorsk": "nn",
  "Norwegian": "no",
  "South Ndebele": "nr",
  "Navajo": "nv",
  "Chichewa": "ny",
  "Occitan": "oc",
  "Ojibwa": "oj",
  "Oromo": "om",
  "Oriya": "or",
  "Ossetian,": "os",
  "Panjabi": "pa",
  "Pali": "pi",
  "Polish": "pl",
  "Pashto": "ps",
  "Portuguese": "pt",
  "Quechua": "qu",
  "Romansh": "rm",
  "Rundi": "rn",
  "Romanian": "ro",
  "Russian": "ru",
  "Kinyarwanda": "rw",
  "Sanskrit": "sa",
  "Sardinian": "sc",
  "Sindhi": "sd",
  "Northern Sami": "se",
  "Sango": "sg",
  "Sinhala": "si",
  "Slovak": "sk",
  "Slovene": "sl",
  "Samoan": "sm",
  "Shona": "sn",
  "Somali": "so",
  "Albanian": "sq",
  "Serbian": "sr",
  "Swati": "ss",
  "Southern Sotho": "st",
  "Sundanese": "su",
  "Swedish": "sv",
  "Swahili": "sw",
  "Tamil": "ta",
  "Telugu": "te",
  "Tajik": "tg",
  "Thai": "th",
  "Tigrinya": "ti",
  "Turkmen": "tk",
  "Tagalog": "tl",
  "Tswana": "tn",
  "Tongan": "to",
  "Turkish": "tr",
  "Tsonga": "ts",
  "Tatar": "tt",
  "Twi": "tw",
  "Tahitian": "ty",
  "Uighur": "ug",
  "Ukrainian": "uk",
  "Urdu": "ur",
  "Uzbek": "uz",
  "Venda": "ve",
  "Vietnamese": "vi",
  "Volapük": "vo",
  "Walloon": "wa",
  "Wolof": "wo",
  "Xhosa": "xh",
  "Yiddish": "yi",
  "Yoruba": "yo",
  "Zhuang": "za",
  "Chinese": "zh",
  "Zulu": "zu",
});

/**
 * A Zod schema that validates language codes.
 *
 * This uses Zod's `nativeEnum()` method to create a schema that validates
 * against the keys of the {@link LANGUAGE_CODE} object.
 *
 * This can be used to validate that a string is a valid `ISO 639` language code.
 *
 * @example
 *
 * ```typescript
 * const validated = LanguageCodeSchema.parse("en"); // ok
 * const invalid = LanguageCodeSchema.parse("xyz"); // throws error
 * ```
 */
export const LanguageCodeSchema = z.nativeEnum(LANGUAGE_CODE);

/**
 * Represents a valid `ISO 639-1` language code.
 */
export type LanguageCode = z.output<typeof LanguageCodeSchema>;

/**
 * Gets the language code for the given language name.
 *
 * @param name - The name of the language to get the code for.
 * @returns The `ISO 639-1` language code for the given language name.
 * @throws {Error} If the provided language name is not supported.
 */
export function getLanguageCode(name: string): LanguageCode {
  if (!(name in LANGUAGE_CODE)) {
    throw new Error(`${name} is not a supported language name.`);
  }

  return LANGUAGE_CODE[name as keyof typeof LANGUAGE_CODE];
}

/**
 * An object mapping `ISO 639-1` language codes to their language names.
 *
 * This is a read-only object that contains mappings from language codes
 * to human-readable language names.
 *
 * The keys are the `ISO 639-1` two-letter language codes and the values
 * are the corresponding language names in English.
 *
 * This can be used to look up the name for a language given its code.
 *
 * @example
 *
 * ```typescript
 * console.log(LANGUAGE_NAME["en"]); // "English"
 * console.log(LANGUAGE_NAME["ja"]); // "Japanese"
 * ```
 */
export const LANGUAGE_NAME = Object.freeze({
  aa: "Afar",
  ab: "Abkhazian",
  ae: "Avestan",
  af: "Afrikaans",
  ak: "Akan",
  am: "Amharic",
  an: "Aragonese",
  ar: "Arabic",
  as: "Assamese",
  av: "Avaric",
  ay: "Aymara",
  az: "Azerbaijani",
  ba: "Bashkir",
  be: "Belarusian",
  bg: "Bulgarian",
  bi: "Bislama",
  bm: "Bambara",
  bn: "Bengali",
  bo: "Tibetan",
  br: "Breton",
  bs: "Bosnian",
  ca: "Catalan",
  ce: "Chechen",
  ch: "Chamorro",
  co: "Corsican",
  cr: "Cree",
  cs: "Czech",
  cu: "Church Slavonic",
  cv: "Chuvash",
  cy: "Welsh",
  da: "Danish",
  de: "German",
  dv: "Divehi",
  dz: "Dzongkha",
  ee: "Ewe",
  el: "Greek",
  en: "English",
  eo: "Esperanto",
  es: "Spanish",
  et: "Estonian",
  eu: "Basque",
  fa: "Persian",
  ff: "Fulah",
  fi: "Finnish",
  fj: "Fijian",
  fo: "Faroese",
  fr: "French",
  fy: "Western Frisian",
  ga: "Irish",
  gd: "Gaelic",
  gl: "Galician",
  gn: "Guaraní",
  gu: "Gujarati",
  gv: "Manx",
  ha: "Hausa",
  he: "Hebrew",
  hi: "Hindi",
  ho: "Hiri Motu",
  hr: "Croatian",
  ht: "Haitian",
  hu: "Hungarian",
  hy: "Armenian",
  hz: "Herero",
  ia: "Interlingua",
  id: "Indonesian",
  ie: "Interlingue",
  ig: "Igbo",
  ii: "Sichuan Yi",
  ik: "Inupiaq",
  io: "Ido",
  is: "Icelandic",
  it: "Italian",
  iu: "Inuktitut",
  ja: "Japanese",
  jv: "Javanese",
  ka: "Georgian",
  kg: "Kongo",
  ki: "Kikuyu",
  kj: "Kuanyama",
  kk: "Kazakh",
  kl: "Kalaallisut",
  km: "Central Khmer",
  kn: "Kannada",
  ko: "Korean",
  kr: "Kanuri",
  ks: "Kashmiri",
  ku: "Kurdish",
  kv: "Komi",
  kw: "Cornish",
  ky: "Kirghiz",
  la: "Latin",
  lb: "Luxembourgish",
  lg: "Ganda",
  li: "Limburgan",
  ln: "Lingala",
  lo: "Lao",
  lt: "Lithuanian",
  lu: "Luba-Katanga",
  lv: "Latvian",
  mg: "Malagasy",
  mh: "Marshallese",
  mi: "Maori",
  mk: "Macedonian",
  ml: "Malayalam",
  mn: "Mongolian",
  mr: "Marathi",
  ms: "Malay",
  mt: "Maltese",
  my: "Burmese",
  na: "Nauru",
  nb: "Norwegian Bokmål",
  nd: "North Ndebele",
  ne: "Nepali",
  ng: "Ndonga",
  nl: "Dutch",
  nn: "Norwegian Nynorsk",
  no: "Norwegian",
  nr: "South Ndebele",
  nv: "Navajo",
  ny: "Chichewa",
  oc: "Occitan",
  oj: "Ojibwa",
  om: "Oromo",
  or: "Oriya",
  os: "Ossetian,",
  pa: "Panjabi",
  pi: "Pali",
  pl: "Polish",
  ps: "Pashto",
  pt: "Portuguese",
  qu: "Quechua",
  rm: "Romansh",
  rn: "Rundi",
  ro: "Romanian",
  ru: "Russian",
  rw: "Kinyarwanda",
  sa: "Sanskrit",
  sc: "Sardinian",
  sd: "Sindhi",
  se: "Northern Sami",
  sg: "Sango",
  si: "Sinhala",
  sk: "Slovak",
  sl: "Slovene",
  sm: "Samoan",
  sn: "Shona",
  so: "Somali",
  sq: "Albanian",
  sr: "Serbian",
  ss: "Swati",
  st: "Southern Sotho",
  su: "Sundanese",
  sv: "Swedish",
  sw: "Swahili",
  ta: "Tamil",
  te: "Telugu",
  tg: "Tajik",
  th: "Thai",
  ti: "Tigrinya",
  tk: "Turkmen",
  tl: "Tagalog",
  tn: "Tswana",
  to: "Tongan",
  tr: "Turkish",
  ts: "Tsonga",
  tt: "Tatar",
  tw: "Twi",
  ty: "Tahitian",
  ug: "Uighur",
  uk: "Ukrainian",
  ur: "Urdu",
  uz: "Uzbek",
  ve: "Venda",
  vi: "Vietnamese",
  vo: "Volapük",
  wa: "Walloon",
  wo: "Wolof",
  xh: "Xhosa",
  yi: "Yiddish",
  yo: "Yoruba",
  za: "Zhuang",
  zh: "Chinese",
  zu: "Zulu",
});

/**
 * A Zod schema that validates language name strings.
 *
 * This uses Zod's `nativeEnum()` method to create a schema that validates
 * strings against the keys of the {@link LANGUAGE_NAME} object.
 *
 * This can be used to validate that a string is a valid `ISO 639`
 * language name in English.
 *
 * @example
 *
 * ```typescript
 * const validated = LanguageNameSchema.parse("English"); // ok
 * const invalid = LanguageNameSchema.parse("Foo"); // throws error
 * ```
 */
export const LanguageNameSchema = z.nativeEnum(LANGUAGE_NAME);

/**
 * Represents a valid `ISO 639` language name in English.
 */
export type LanguageName = z.output<typeof LanguageNameSchema>;

/**
 * Gets the language name for the given language code.
 *
 * @param code - The `ISO 639-1` language code to get the name for.
 * @returns The English name of the language corresponding to the code.
 * @throws {Error} If the provided code is not a supported `ISO 639-1` code.
 */
export function getLanguageName(code: string): LanguageName {
  if (!(code in LANGUAGE_NAME)) {
    throw new Error(`${code} is not a supported language code.`);
  }

  return LANGUAGE_NAME[code as keyof typeof LANGUAGE_NAME];
}
