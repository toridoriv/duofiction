import { JSX } from "@components/deps.ts";

export function Favicon(props: JSX.HTMLAttributes<HTMLLinkElement>) {
  return <link rel="icon" {...props} />;
}

export function PreloadedStylesheet(
  props: JSX.HTMLAttributes<HTMLLinkElement>,
) {
  return (
    <link
      as="style"
      rel="preload"
      // @ts-ignore: ¯\_(ツ)_/¯
      onload="this.onload=null;this.rel='stylesheet'"
      {...props}
    />
  );
}
