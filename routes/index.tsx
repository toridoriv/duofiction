import { Handlers, PageProps } from "$fresh/server.ts";
import { FanfictionCard } from "@components/fanfiction-card.tsx";
import { FanfictionAttributesOutput } from "@modules/fanfiction/mod.ts";
import { handler as FanfictionAttributesHandler } from "./api/fanfiction-attributes/index.ts";

type HomeState = {
  subtitle: string;
};

interface HomeData {
  recentlyAdded: FanfictionAttributesOutput[];
  recentlyUpdated: FanfictionAttributesOutput[];
}

export const handler: Handlers<HomeData, HomeState> = {
  async GET(req, ctx) {
    const baseUrl = new URL(req.url);
    const recentlyAddedRequest = new Request(
      new URL(
        "/api/fanfiction-attributes?limit=3&sort=created_at&order=DESCENDING",
        baseUrl.origin,
      ),
    );
    const recentlyAddedResponse = await FanfictionAttributesHandler.GET(
      recentlyAddedRequest,
      ctx,
    );
    const recentlyAdded = await recentlyAddedResponse.json();

    const recentlyUpdatedRequest = new Request(
      new URL(
        "/api/fanfiction-attributes?limit=3&sort=updated_at&order=DESCENDING",
        baseUrl.origin,
      ),
    );
    const recentlyUpdatedResponse = await FanfictionAttributesHandler.GET(
      recentlyUpdatedRequest,
      ctx,
    );
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
