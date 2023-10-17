import { z } from "@modules/fanfiction/deps.ts";

export type AuthorInput = z.input<typeof AuthorSchema>;
export type AuthorOutput = z.output<typeof AuthorSchema>;

export const AuthorSchema = z.object({
  name: z.string().min(1).default("Anonymous"),
  url: z.string().url(),
});
