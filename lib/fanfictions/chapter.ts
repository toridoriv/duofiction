import { z } from "@deps";
import { Localization } from "./localization.ts";
import { Paragraph } from "./paragraph.ts";
import { Text } from "./text.ts";

export namespace OneShot {
  type schema = typeof OneShot.schema;

  export type input = z.input<schema>;
  export type output = z.output<schema>;
}

export interface OneShot extends OneShot.output {}

export class OneShot {
  static readonly schema = z.object({
    paragraphs: z.array(Paragraph.schema).default([]).transform(toParagraphAll),
  });

  public static create(properties: OneShot.input) {
    return new OneShot(properties);
  }

  public static parse(properties: OneShot.output) {
    return new OneShot(properties);
  }

  constructor(properties: OneShot.input) {
    Object.assign(this, OneShot.schema.parse(properties));
  }

  public validate() {
    Object.assign(this, OneShot.schema.parse(this));

    return this;
  }

  public getValidation() {
    return OneShot.schema.safeParse(this);
  }

  public isValid() {
    return OneShot.schema.safeParse(this).success;
  }

  public getParagraphByHashOrIndex(hashOrIndex: string | number) {
    if (typeof hashOrIndex === "number") {
      return this.paragraphs[hashOrIndex];
    }

    return this.paragraphs.find((x) => x.hash === hashOrIndex);
  }

  public addParagraph(original: Text, translation?: Text) {
    const translations = [] as Text[];

    if (translation) {
      translations.push(translation);
    }

    const paragraph = new Paragraph({
      original,
      index: this.paragraphs.length,
      hash: "",
      translations,
    });

    this.paragraphs.push(paragraph);

    return this;
  }

  public addTranslation(hash: string, translation: Text) {
    const paragraph = this.getParagraphByHashOrIndex(hash);

    if (!paragraph) {
      throw new Error();
    }

    paragraph.translations.push(translation);

    return this;
  }
}

export namespace MultiChapter {
  type schema = typeof MultiChapter.schema;

  export type input = z.input<schema>;
  export type output = z.output<schema>;
}

export interface MultiChapter extends MultiChapter.output {}

export class MultiChapter extends OneShot {
  static readonly schema = z.object({
    title: Localization.schema.transform(Localization.parse),
    paragraphs: z.array(Paragraph.schema).default([]).transform(toParagraphAll),
    summary: Localization.schema.transform(Localization.parse).nullable()
      .default(null),
  });

  public static create(properties: MultiChapter.input) {
    return new MultiChapter(properties);
  }

  public static parse(properties: MultiChapter.output) {
    return new MultiChapter(properties);
  }

  constructor(properties: MultiChapter.input) {
    super(properties);
    Object.assign(this, MultiChapter.schema.parse(properties));
  }

  public validate() {
    Object.assign(this, MultiChapter.schema.parse(this));

    return this;
  }

  public getValidation() {
    return MultiChapter.schema.safeParse(this);
  }

  public isValid() {
    return MultiChapter.schema.safeParse(this).success;
  }
}

function toParagraphAll(value: Paragraph.output[]) {
  return value.map(Paragraph.parse);
}

export type Chapter = OneShot | MultiChapter;
