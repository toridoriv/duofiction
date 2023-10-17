import { JSX } from "@components/deps.ts";
import {
  getMainTranslation,
  getTextToDisplay,
  hasMainTranslation,
  TextWithTranslationsOutput,
} from "@modules/fanfiction/mod.ts";

export interface FanfictionSummaryProps
  extends Omit<JSX.HTMLAttributes<HTMLElement>, "summary"> {
  summary: TextWithTranslationsOutput;
  originalTextProps: JSX.HTMLAttributes<HTMLParagraphElement>;
  translatedTextProps: JSX.HTMLAttributes<HTMLParagraphElement>;
}

export function FanfictionSummary(
  { summary, originalTextProps, translatedTextProps, ...props }:
    FanfictionSummaryProps,
) {
  const mainTranslation = getMainTranslation(summary);

  return (
    <section {...props}>
      <p lang={summary.original.language_code} {...originalTextProps}>
        {getTextToDisplay(summary.original)}
      </p>
      {hasMainTranslation(summary)
        ? (
          <p lang={mainTranslation.language_code} {...translatedTextProps}>
            {getTextToDisplay(mainTranslation)}
          </p>
        )
        : null}
    </section>
  );
}
