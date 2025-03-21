import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-react"],
  manifest: {
    permissions: ["activeTab", "contextMenus", "scripting", "storage"],
    host_permissions: [
      "https://chatgpt.com/*",
      "https://gemini.google.com/*",
      "https://claude.ai/*",
      "https://chat.deepseek.com/*",
    ],
    content_security_policy: {
      extension_pages:
        "script-src 'self' 'wasm-unsafe-eval' http://localhost:*; object-src 'self'",
    },
  },
});
