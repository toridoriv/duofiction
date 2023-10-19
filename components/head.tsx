import { asset, JSX } from "@components/deps.ts";

export function Favicon(
  { href, ...props }: JSX.HTMLAttributes<HTMLLinkElement>,
) {
  return <link rel="icon" href={asset(href as string)} {...props} />;
}

export function PreloadedStylesheet(
  { href, ...props }: JSX.HTMLAttributes<HTMLLinkElement>,
) {
  return (
    <link
      as="style"
      rel="preload"
      // @ts-ignore: ¯\_(ツ)_/¯
      onload="this.onload=null;this.rel='stylesheet'"
      href={asset(href as string)}
      {...props}
    />
  );
}
