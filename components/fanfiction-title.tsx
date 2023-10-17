import { JSX } from "@components/deps.ts";
import {
  getMainTranslation,
  getTextToDisplay,
  hasMainTranslation,
  TextWithTranslationsOutput,
} from "@modules/fanfiction/mod.ts";

export interface FanfictionTitleProps
  extends Omit<JSX.HTMLAttributes<HTMLHeadingElement>, "title"> {
  title: TextWithTranslationsOutput;
  id: string;
  headingLevel: 1 | 2 | 3 | 4 | 5 | 6;
}

export function FanfictionTitle(
  { title, id, headingLevel, ...props }: FanfictionTitleProps,
) {
  const Heading = `h${headingLevel}` as `h${typeof headingLevel}`;
  const mainTranslation = getMainTranslation(title);

  return (
    <Heading {...props}>
      <a
        href={`/fanfictions/${id}`}
        class="link-success link-underline link-underline-opacity-0 with-translation"
      >
        <span lang={title.original.language_code}>
          {getTextToDisplay(title.original)}
        </span>
        {hasMainTranslation(title)
          ? (
            <span lang={mainTranslation.language_code}>
              ({getTextToDisplay(mainTranslation)})
            </span>
          )
          : null}
      </a>
    </Heading>
  );
}
