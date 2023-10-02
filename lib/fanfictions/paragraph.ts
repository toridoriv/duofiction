import { encode, Hash, z } from "@deps";
import { Localization } from "./localization.ts";
import { Text } from "./text.ts";
import { Base } from "./base.ts";

export namespace Paragraph {
  type schema = typeof Paragraph.schema;

  export type input = z.input<schema>;
  export type output = z.output<schema>;
}

export interface Paragraph extends Paragraph.output {}

export class Paragraph extends Base {
  static readonly schema = Localization.schema.extend({
    index: z.number().int(),
    hash: z.string(),
  }).transform(createHash);

  public static create(properties: Paragraph.input) {
    return new Paragraph(properties);
  }

  public static parse(properties: Paragraph.output) {
    return new Paragraph(properties);
  }

  constructor(properties: Paragraph.input) {
    super();
    Object.assign(this, Paragraph.schema.parse(properties));
  }

  toJSON() {
    return { ...this };
  }

  public getMainTranslation(): Text | null {
    return this.translations[0] || null;
  }

  public validate() {
    Object.assign(this, Paragraph.schema.parse(this));
  }

  public getValidation() {
    return Paragraph.schema.safeParse(this);
  }

  public isValid() {
    return Paragraph.schema.safeParse(this).success;
  }
}

function createHash<T extends { hash: string; original: { raw: string } }>(
  value: T,
) {
  if (!value.hash) {
    value.hash = new Hash("md5").digest(encode(value.original.raw)).hex();
  }

  return value;
}
