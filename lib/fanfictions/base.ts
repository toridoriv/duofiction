// deno-lint-ignore-file ban-types
export abstract class Base {
  abstract toJSON(): Object;

  toString() {
    return JSON.stringify(this.toJSON(), null, 2);
  }
}
