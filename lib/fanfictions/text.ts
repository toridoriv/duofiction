import { z } from "@deps";
import { LanguageCodeSchema, LanguageNameSchema } from "../language/mod.ts";

export namespace Text {
  type schema = typeof Text.schema;

  export type input = z.input<schema>;
  export type output = z.output<schema>;
}

export interface Text extends Text.output {}

export class Text {
  static readonly schema = z.object({
    raw: z.string().min(1).trim(),
    rich: z.string().trim().default(""),
    language_code: LanguageCodeSchema,
    language: LanguageNameSchema,
  });

  public static create(properties: Text.input) {
    return new Text(properties);
  }

  public static parse(properties: Text.output) {
    return new Text(properties);
  }

  constructor(properties: Text.input) {
    Object.assign(this, Text.schema.parse(properties));
  }

  public validate() {
    Object.assign(this, Text.schema.parse(this));
  }

  public getValidation() {
    return Text.schema.safeParse(this);
  }

  public isValid() {
    return Text.schema.safeParse(this).success;
  }
}
