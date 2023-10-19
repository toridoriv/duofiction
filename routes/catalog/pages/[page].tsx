import { Handlers, PageProps } from "$fresh/server.ts";
import { FanfictionCard } from "@components/fanfiction-card.tsx";
import { FanfictionAttributesOutput } from "@modules/fanfiction/mod.ts";
import { handler as FanfictionAttributesHandler } from "@routes/api/fanfiction-attributes/index.ts";
import { calculateTotalPages, getPageNumbers } from "@utils/mod.ts";
import { NavPagination, NavPaginationProps } from "@components/nav.tsx";

type CatalogPageState = {
  subtitle: string;
  navigationProps: NavPaginationProps;
};

const LIMIT = 2;
const PAGE_TEMPLATE = "/catalog/pages/:page" as const;

export const handler: Handlers<FanfictionAttributesOutput[], CatalogPageState> =
  {
    async GET(req, ctx) {
      const page = Number(ctx.params.page);
      const response = await FanfictionAttributesHandler.GET(null, {
        params: {
          sort: "created_at",
          order: "ASCENDING",
          size: LIMIT,
          offset: (page - 1) * LIMIT,
        },
      });
      const { data: fanfictionAttributes, $metadata } = await response.json();
      const totalPages = calculateTotalPages($metadata.total, LIMIT);
      const pageNumbers = getPageNumbers(totalPages);

      const navigationProps: NavPaginationProps = {
        "aria-label": "Page navigation catalog",
        pageTemplate: PAGE_TEMPLATE,
        currentPage: page,
        lastPage: pageNumbers[pageNumbers.length - 1],
        pagesProps: pageNumbers.map((pageNumber) => ({
          isActive: page === pageNumber,
          href: PAGE_TEMPLATE.replace(":page", `${pageNumber}`),
          page: pageNumber,
        })),
      };

      ctx.state.navigationProps = navigationProps;

      return ctx.render(fanfictionAttributes);
    },
  };

export default function CatalogPage(
  { data, state }: PageProps<FanfictionAttributesOutput[], CatalogPageState>,
) {
  return (
    <section>
      {data.map((fanfiction) => FanfictionCard({ fanfiction }))}
      {NavPagination(state.navigationProps)}
    </section>
  );
}
