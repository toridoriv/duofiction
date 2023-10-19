import { AppProps } from "$fresh/server.ts";
import { Partial } from "$fresh/runtime.ts";
import { Navbar } from "@components/nav.tsx";
import { Favicon, PreloadedStylesheet } from "@components/head.tsx";
import config from "@modules/config/mod.ts";

export interface AppProperties {
  subtitle?: string;
}

const links = [
  { children: "🏠 Home", href: "/" },
  { children: "📚 Catalog", href: "/catalog/pages/1" },
  { children: "🏷️ Tags", href: "/tags" },
  { children: "🌐 Languages", href: "/languages" },
];

const favicons = [
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/assets/apple-touch-icon.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/assets/favicon-32x32.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: "/assets/favicon-16x16.png",
  },
  {
    rel: "icon",
    type: "image/x-icon",
    sizes: "any",
    href: "/assets/favicon.ico",
  },
];

const stylesheets = [
  {
    href: "https://cdn.jsdelivr.net/npm/halfmoon@2.0.1/css/halfmoon.min.css",
  },
  {
    href: "https://cdn.jsdelivr.net/npm/victormono@latest/dist/index.min.css",
  },
  {
    href: "/styles/main.css",
  },
];

export default function App(
  { Component, state }: AppProps<AppProperties, AppProperties>,
) {
  const title = state.subtitle
    ? `${state.subtitle} | Duofiction`
    : "Duofiction";

  return (
    <html lang="en" data-bs-theme="dark" data-bs-core="modern">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="NOINDEX, NOFOLLOW" />
        <title>{title}</title>
        {favicons.map(Favicon)}
        <link
          rel="manifest"
          href={config.ENVIRONMENT === "DEVELOPMENT"
            ? "/assets/dev-site.webmanifest"
            : "/assets/site.webmanifest"}
        />
        {stylesheets.map(PreloadedStylesheet)}
      </head>
      <body class="subpixel-antialiased" f-client-nav>
        {Navbar(links)}
        <main class="container">
          <Partial name="main-content">
            <Component />
          </Partial>
        </main>
        <script
          async
          src="https://kit.fontawesome.com/a1f28487fc.js"
          crossorigin="anonymous"
        >
        </script>
        <script
          async
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
          crossorigin="anonymous"
        >
        </script>
        <script type="module" src="/scripts/main.mjs"></script>
      </body>
    </html>
  );
}
