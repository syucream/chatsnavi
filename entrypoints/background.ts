export interface ChatGPTSetting {
  name: string;
  autoSubmit: boolean;
  activate: boolean;
  gpt?: string;
}

export interface GeminiSetting {
  name: string;
  autoSubmit: boolean;
  activate: boolean;
}

export interface ClaudeSetting {
  name: string;
  autoSubmit: boolean;
  activate: boolean;
}

export type MessagePayload = {
  type: "FILL_PROMPT";
  target: "chatgpt" | "gemini" | "claude";
  text: string;
  autoSubmit: boolean;
};

export const storage = {
  async getItems(
    keys: ("chatGPTSettings" | "geminiSettings" | "claudeSettings")[],
  ) {
    return browser.storage.local.get(keys) as Promise<{
      chatGPTSettings?: ChatGPTSetting[];
      geminiSettings?: GeminiSetting[];
      claudeSettings?: ClaudeSetting[];
    }>;
  },
  async getItem(key: "chatGPTSettings" | "geminiSettings" | "claudeSettings") {
    const result = await browser.storage.local.get(key);
    return result[key] as
      | ChatGPTSetting[]
      | GeminiSetting[]
      | ClaudeSetting[]
      | undefined;
  },
  watch(callback: () => void) {
    browser.storage.onChanged.addListener(callback);
  },
};

const CHATGPT_URL = "https://chatgpt.com/";
const GEMINI_URL = "https://gemini.google.com/app";
const CLAUDE_URL = "https://claude.ai/chats";

const MENU_ROOT = "root";
const MENU_CHATGPT = "chatgpt--";
const MENU_GEMINI = "gemini--";
const MENU_CLAUDE = "claude--";

export default defineBackground({
  main() {
    // popup を無効にして、クリック時に設定画面を開く
    browser.action.setPopup({ popup: "" });
    browser.action.onClicked.addListener(() => {
      browser.runtime.openOptionsPage();
    });

    const updateContextMenus = async () => {
      await browser.contextMenus.removeAll();

      await browser.contextMenus.create({
        id: MENU_ROOT,
        title: "ChatsNavi",
        contexts: ["selection"],
      });

      const {
        chatGPTSettings = [],
        geminiSettings = [],
        claudeSettings = [],
      } = await storage.getItems([
        "chatGPTSettings",
        "geminiSettings",
        "claudeSettings",
      ]);

      chatGPTSettings.forEach((setting, index) => {
        browser.contextMenus.create({
          id: `${MENU_CHATGPT}${index}`,
          parentId: MENU_ROOT,
          title: setting.name,
          contexts: ["selection"],
        });
      });

      geminiSettings.forEach((setting, index) => {
        browser.contextMenus.create({
          id: `${MENU_GEMINI}${index}`,
          parentId: MENU_ROOT,
          title: setting.name,
          contexts: ["selection"],
        });
      });

      claudeSettings.forEach((setting, index) => {
        browser.contextMenus.create({
          id: `${MENU_CLAUDE}${index}`,
          parentId: MENU_ROOT,
          title: setting.name,
          contexts: ["selection"],
        });
      });
    };

    browser.contextMenus.onClicked.addListener(async (info, tab) => {
      if (
        !tab?.id ||
        typeof info.menuItemId !== "string" ||
        !info.selectionText
      )
        return;

      if (info.menuItemId.startsWith(MENU_CHATGPT)) {
        const index = parseInt(info.menuItemId.slice(MENU_CHATGPT.length));
        const settings = await storage.getItem("chatGPTSettings");
        const setting = settings?.[index] as ChatGPTSetting;
        if (!setting) return;

        const url = setting.gpt
          ? `${CHATGPT_URL}g/${setting.gpt}`
          : CHATGPT_URL;
        const newTab = await browser.tabs.create({
          url,
          active: setting.activate,
        });

        browser.tabs.onUpdated.addListener(
          function listener(tabId, changeInfo) {
            if (tabId === newTab.id && changeInfo.status === "complete") {
              browser.tabs.onUpdated.removeListener(listener);
              browser.tabs.sendMessage(tabId, {
                type: "FILL_PROMPT",
                target: "chatgpt",
                text: info.selectionText,
                autoSubmit: setting.autoSubmit,
              });
            }
          },
        );
      }

      if (info.menuItemId.startsWith(MENU_GEMINI)) {
        const index = parseInt(info.menuItemId.slice(MENU_GEMINI.length));
        const settings = await storage.getItem("geminiSettings");
        const setting = settings?.[index];
        if (!setting) return;

        const newTab = await browser.tabs.create({
          url: GEMINI_URL,
          active: setting.activate,
        });

        browser.tabs.onUpdated.addListener(
          function listener(tabId, changeInfo) {
            if (tabId === newTab.id && changeInfo.status === "complete") {
              browser.tabs.onUpdated.removeListener(listener);
              browser.tabs.sendMessage(tabId, {
                type: "FILL_PROMPT",
                target: "gemini",
                text: info.selectionText,
                autoSubmit: setting.autoSubmit,
              });
            }
          },
        );
      }

      if (info.menuItemId.startsWith(MENU_CLAUDE)) {
        const index = parseInt(info.menuItemId.slice(MENU_CLAUDE.length));
        const settings = await storage.getItem("claudeSettings");
        const setting = settings?.[index];
        if (!setting) return;

        const newTab = await browser.tabs.create({
          url: CLAUDE_URL,
          active: setting.activate,
        });

        browser.tabs.onUpdated.addListener(
          function listener(tabId, changeInfo) {
            if (tabId === newTab.id && changeInfo.status === "complete") {
              browser.tabs.onUpdated.removeListener(listener);
              browser.tabs.sendMessage(tabId, {
                type: "FILL_PROMPT",
                target: "claude",
                text: info.selectionText,
                autoSubmit: setting.autoSubmit,
              });
            }
          },
        );
      }
    });

    browser.runtime.onInstalled.addListener(updateContextMenus);
    browser.runtime.onStartup.addListener(updateContextMenus);
    storage.watch(updateContextMenus);
  },
});
