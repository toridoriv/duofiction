import { z } from "@deps";
import { Text } from "./text.ts";

export namespace Localization {
  type schema = typeof Localization.schema;

  export type input = z.input<schema>;
  export type output = z.output<schema>;
}

export interface Localization extends Localization.output {}

export class Localization {
  static readonly schema = z.object({
    original: Text.schema.transform(toText),
    translations: z.array(Text.schema).default([]).transform(toTextAll),
  });

  public static create(properties: Localization.input) {
    return new Localization(properties);
  }

  public static parse(properties: Localization.output) {
    if (properties instanceof Localization) {
      return properties;
    }

    return new Localization(properties);
  }

  constructor(properties: Localization.input) {
    Object.assign(this, Localization.schema.parse(properties));
  }

  public getMainTranslation(): Text | null {
    return this.translations[0] || null;
  }

  public validate() {
    Object.assign(this, Localization.schema.parse(this));
  }

  public getValidation() {
    return Localization.schema.safeParse(this);
  }

  public isValid() {
    return Localization.schema.safeParse(this).success;
  }
}

function toText(value: Text.output) {
  return Text.parse(value);
}

function toTextAll(value: Text.output[]) {
  return value.map(toText);
}
