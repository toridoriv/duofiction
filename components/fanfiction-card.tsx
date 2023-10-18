import { TagButton } from "@components/tag-button.tsx";
import { type FanfictionAttributesOutput } from "@modules/fanfiction/mod.ts";
import { getAllTags } from "@utils/mod.ts";
import { JSX } from "@components/deps.ts";
import { FanfictionTitle } from "@components/fanfiction-title.tsx";
import { FanfictionSummary } from "@components/fanfiction-summary.tsx";

export interface FanfictionCardProps extends JSX.HTMLAttributes<HTMLElement> {
  fanfiction: FanfictionAttributesOutput;
}

export function FanfictionCard({ fanfiction, ...props }: FanfictionCardProps) {
  const { id, title, summary } = fanfiction;
  const tags = getAllTags(fanfiction);

  return (
    <article class="card" {...props}>
      <div class="card-body">
        {FanfictionTitle({
          title,
          id,
          class: "card-title",
          headingLevel: 3,
        })}
        {FanfictionSummary({
          class: "card-text summary",
          summary,
          originalTextProps: {
            class: "card-text",
          },
          translatedTextProps: {
            class:
              "card-text translation text-secondary-emphasis text-opacity-75",
          },
        })}
      </div>
      <div class="card-footer">
        <p style="text-align:center;">
          {tags.map(TagButton)}
        </p>
      </div>
    </article>
  );
}
