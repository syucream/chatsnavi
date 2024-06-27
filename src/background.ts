const CHATGPT_URL = "https://chatgpt.com/";
const GEMINI_URL = "https://gemini.google.com/app";

const MENU_ROOT = "root";
const MENU_CHATGPT = "chatgpt--";
const MENU_GEMINI = "gemini--";

const operateChatGPT = (promptText: string, chatGPTSetting: ChatGPTSetting) => {
  setTimeout(() => {
    const userPrompt: HTMLTextAreaElement | null =
      document.querySelector("#prompt-textarea");
    const submitButton: HTMLButtonElement | null = document.querySelector(
      'button[data-testid="fruitjuice-send-button"]',
    );

    if (userPrompt && submitButton) {
      userPrompt.value = promptText;
      userPrompt.dispatchEvent(new InputEvent("input", { bubbles: true }));
      if (chatGPTSetting.autoSubmit) {
        submitButton.click();
      }
    } else {
      console.error("Failed to operate on ChatGPT");
    }
  }, 500);
};

const operateGemini = (promptText: string, geminiSettming: GeminiSetting) => {
  setTimeout(() => {
    const userPrompt: HTMLParagraphElement | null =
      document.querySelector("rich-textarea")?.querySelector("p") ?? null;
    const submitButton: HTMLButtonElement | null =
      document.querySelector(".send-button");

    if (userPrompt && submitButton) {
      userPrompt.textContent = promptText;
      if (geminiSettming.autoSubmit) {
        // delay to submit
        setTimeout(() => {
          submitButton.click();
        }, 500);
      }
    } else {
      console.error("Failed to operate on Gemini");
    }
  }, 500);
};

const updateContextMenus = () => {
  chrome.contextMenus.removeAll();

  chrome.contextMenus.create({
    id: MENU_ROOT,
    title: "ChatsNavi",
    contexts: ["selection"],
  });

  chrome.storage.local.get(["chatGPTSettings", "geminiSettings"], (items) => {
    if (items.chatGPTSettings) {
      (items as { chatGPTSettings: ChatGPTSetting[] }).chatGPTSettings.forEach(
        (setting, index) => {
          chrome.contextMenus.create({
            id: MENU_CHATGPT + index,
            parentId: MENU_ROOT,
            title: setting.name,
            contexts: ["selection"],
          });
        },
      );
    }

    if (items.geminiSettings) {
      (items as { geminiSettings: GeminiSetting[] }).geminiSettings.forEach(
        (setting, index) => {
          chrome.contextMenus.create({
            id: MENU_GEMINI + index,
            parentId: MENU_ROOT,
            title: setting.name,
            contexts: ["selection"],
          });
        },
      );
    }
  });
};

chrome.runtime.onInstalled.addListener(updateContextMenus);
chrome.runtime.onStartup.addListener(updateContextMenus);
chrome.storage.onChanged.addListener(updateContextMenus);

chrome.contextMenus.onClicked.addListener(
  (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
    if (tab == null || typeof info.menuItemId !== "string") {
      return;
    }

    if (info.menuItemId.startsWith(MENU_CHATGPT)) {
      const settingIndex = parseInt(info.menuItemId.slice(MENU_CHATGPT.length));
      const selectedText = info.selectionText;

      chrome.storage.local.get("chatGPTSettings", (items) => {
        if (items.chatGPTSettings) {
          (
            items as { chatGPTSettings: ChatGPTSetting[] }
          ).chatGPTSettings.forEach((setting, index) => {
            if (index === settingIndex) {
              const url =
                setting.gpt?.length ?? 0 > 0
                  ? CHATGPT_URL + `g/${setting.gpt}`
                  : CHATGPT_URL;
              chrome.tabs.create(
                { url, active: setting.activate },
                (newTab: chrome.tabs.Tab) => {
                  chrome.tabs.onUpdated.addListener(function listener(
                    tabId: number,
                    changeInfo,
                  ) {
                    if (
                      tabId === newTab.id &&
                      changeInfo.status === "complete"
                    ) {
                      chrome.tabs.onUpdated.removeListener(listener);
                      if (selectedText != null) {
                        chrome.scripting.executeScript({
                          target: { tabId: newTab.id },
                          func: operateChatGPT,
                          args: [selectedText, setting],
                        });
                      }
                    }
                  });
                },
              );
            }
          });
        }
      });
    }

    if (info.menuItemId.startsWith(MENU_GEMINI)) {
      const settingIndex = parseInt(info.menuItemId.slice(MENU_GEMINI.length));
      const selectedText = info.selectionText;

      chrome.storage.local.get("geminiSettings", (items) => {
        if (items.geminiSettings) {
          (items as { geminiSettings: GeminiSetting[] }).geminiSettings.forEach(
            (setting, index) => {
              if (index === settingIndex) {
                chrome.tabs.create(
                  { url: GEMINI_URL, active: setting.activate },
                  (newTab: chrome.tabs.Tab) => {
                    chrome.tabs.onUpdated.addListener(function listener(
                      tabId: number,
                      changeInfo,
                    ) {
                      if (
                        tabId === newTab.id &&
                        changeInfo.status === "complete"
                      ) {
                        chrome.tabs.onUpdated.removeListener(listener);
                        if (selectedText != null) {
                          chrome.scripting.executeScript({
                            target: { tabId: newTab.id },
                            func: operateGemini,
                            args: [selectedText, setting],
                          });
                        }
                      }
                    });
                  },
                );
              }
            },
          );
        }
      });
    }
  },
);
