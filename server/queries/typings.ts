import type { Collection, Fanfictions } from "@deps";

export type FanfictionsCollection = Collection<Fanfictions.Fanfiction.output>;

export type Tag = {
  name: string;
  value: string;
  href: string;
  total: number;
};
