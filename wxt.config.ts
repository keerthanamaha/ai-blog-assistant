import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-react"],
  manifest: ({ browser, manifestVersion, mode, command }) => {
    return {
      manifest_version: 2,
      name: "Reddit Assistant",
      description: "Build by Hasan with ❤️",
      version: "1.0.0",
      permissions: [
        "activeTab",
        "scripting",
        "contextMenus",
        "tabs",
        "storage",
      ],
    };
  },
});
