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
    const recentlyAddedResponse = await FanfictionAttributesHandler.GET(null, {
      params: { sort: "created_at", order: "ASCENDING", size: 3 },
    });
    const { data: recentlyAdded } = await recentlyAddedResponse.json();

    const recentlyUpdatedResponse = await FanfictionAttributesHandler.GET(
      null,
      { params: { sort: "updated_at", order: "DESCENDING", size: 3 } },
    );
    const { data: recentlyUpdated } = await recentlyUpdatedResponse.json();

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
