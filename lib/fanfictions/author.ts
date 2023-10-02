import { z } from "@deps";

export namespace Author {
  type schema = typeof Author.schema;

  export type input = z.input<schema>;
  export type output = z.output<schema>;
}

export interface Author extends Author.output {}

export class Author {
  static readonly schema = z.object({
    name: z.string().min(1).default("Anonymous"),
    url: z.string().url(),
  });

  public static create(properties: Author.input) {
    return new Author(properties);
  }

  public static parse(properties: Author.output) {
    return new Author(properties);
  }

  constructor(properties: Author.input) {
    Object.assign(this, Author.schema.parse(properties));
  }

  public validate() {
    Object.assign(this, Author.schema.parse(this));
  }

  public getValidation() {
    return Author.schema.safeParse(this);
  }

  public isValid() {
    return Author.schema.safeParse(this).success;
  }
}
