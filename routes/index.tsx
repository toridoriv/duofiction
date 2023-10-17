import { Handlers, PageProps } from "$fresh/server.ts";
import { FanfictionCard } from "@components/fanfiction-card.tsx";
import { FanfictionAttributesOutput } from "@modules/fanfiction/mod.ts";
import { logger } from "@utils/mod.ts";

interface HomeState {
  subtitle: string;
}

interface HomeData {
  recentlyAdded: FanfictionAttributesOutput[];
  recentlyUpdated: FanfictionAttributesOutput[];
}

export const handler: Handlers<HomeData, HomeState> = {
  async GET(req, ctx) {
    const baseUrl = new URL(req.url);
    const recentlyAddedUrl = new URL(
      "/api/fanfiction-attributes?limit=3&sort=created_at&order=DESCENDING",
      baseUrl.origin,
    );
    const recentlyAddedResponse = await fetch(recentlyAddedUrl);
    const recentlyAdded = await recentlyAddedResponse.json();

    const recentlyUpdatedUrl = new URL(
      "/api/fanfiction-attributes?limit=3&sort=updated_at&order=DESCENDING",
      baseUrl.origin,
    );
    const recentlyUpdatedResponse = await fetch(recentlyUpdatedUrl);
    const recentlyUpdated = await recentlyUpdatedResponse.json();

    ctx.state.subtitle = "Home";

    return ctx.render({ recentlyAdded, recentlyUpdated });
  },
};

export default function Home({ data }: PageProps<HomeData, HomeState>) {
  return (
    <section>
      <h2>Recently Added</h2>
      {data.recentlyAdded.map((fanfiction) => FanfictionCard({ fanfiction }))}
      <h2>Recently Updated</h2>
      {data.recentlyUpdated.map((fanfiction) => FanfictionCard({ fanfiction }))}
    </section>
  );
}
