import { z } from "@deps";

export const anySchema = z.custom<z.ZodTypeAny>((x) => x instanceof z.Schema);

export const rawPayloadSchema = z.object({
  body: z.null().default(null).catch(null),
  query: z.null().default(null).catch(null),
  params: z.null().default(null).catch(null),
});

export const sharedSettingsSchema = z.object({
  path: z.string().default("/"),
  payload: z.object({
    body: anySchema.optional(),
    query: anySchema.optional(),
    params: anySchema.optional(),
  }).default({}),
});

export type DefaultPayload = typeof rawPayloadSchema["shape"];

export type InferSettings<
  Schema extends z.ZodTypeAny,
  Input extends z.input<Schema> = z.input<Schema>,
  Output extends z.output<Schema> = z.output<Schema>,
> = {
  [K in keyof Output]: Input[K] extends Nullable ? Output[K] : Input[K];
};

export type PayloadSchema<T> = z.ZodObject<InferPayloadShape<T>>;

export type InferPayload<T, S extends PayloadSchema<T> = PayloadSchema<T>> =
  z.output<
    S
  >;

type PayloadSchemaShape = {
  body: z.ZodTypeAny;
  params: z.ZodTypeAny;
  query: z.ZodTypeAny;
};

type InferPayloadShape<T> = {
  [K in keyof PayloadSchemaShape]: K extends keyof T
    ? T[K] extends z.ZodTypeAny ? T[K] : DefaultPayload[K]
    : DefaultPayload[K];
};

type Nullable = never | undefined | unknown;
