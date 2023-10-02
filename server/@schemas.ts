import { z } from "@deps";

export const anySchema = z.custom<z.ZodTypeAny>((x) => x instanceof z.Schema);

export const nullSchema = z.custom<z.ZodNull>().default(z.null()).catch(
  z.null(),
);

export type InferDefault<T> = T extends z.ZodTypeAny
  ? T extends z.ZodDefault<SafeAny> ? ReturnType<Parameters<T["default"]>[0]>
  : undefined
  : never;

export type RawShape<K extends string = string> = {
  [X in K]: z.ZodTypeAny;
};
