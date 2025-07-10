import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: ({ browser, manifestVersion, mode, command }) => {
    return {
      manifest_version: 3,
      name: "WXT Content Script Example",
      version: "1.0.0",
      description: "An example content script using WXT.",
      permissions: ["tabs", "storage"],
    };
  },
});
