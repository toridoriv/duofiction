import denoJson from "./deno.json" assert { type: "json" };

/** @type {import("@deps").PrettierConfig} */
const config = {
  overrides: [{
    files: ["*.handlebars", "*.html"],
    options: {
      parser: "html",
      jsxBracketSameLine: true,
      bracketSameLine: true,
      htmlWhitespaceSensitivity: "strict",
    },
  }, {
    files: "*.ts",
    options: {
      trailingComma: "all",
      tabWidth: denoJson.fmt.indentWidth,
      semi: denoJson.fmt.semiColons,
      singleQuote: denoJson.fmt.singleQuote,
      quoteProps: "consistent",
      printWidth: denoJson.fmt.lineWidth,
      parser: "typescript",
    },
  }],
};

export default config;
