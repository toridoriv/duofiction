import { CliffyCommand } from "../../deps.ts";
import { generateManifest } from "@modules/server/manifest.ts";

const ManifestCommand = new CliffyCommand.Command()
  .name("manifest")
  .description("Generate the server manifest.")
  .option("-d, --dir <string>", "Routes directory", { required: true })
  .action(function main(options) {
    generateManifest(options.dir);
  });

if (import.meta.main) {
  ManifestCommand.parse(Deno.args);
}

export default ManifestCommand;
