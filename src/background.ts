const CHATGPT_URL = "https://chatgpt.com/";
const GEMINI_URL = "https://gemini.google.com/app";

const MENU_ROOT = "root";
const MENU_EXP1 = "exp1";
const MENU_EXP2 = "exp2";

const operateChatGPT = (promptText: string) => {
  setTimeout(() => {
    const userPrompt: HTMLTextAreaElement | null = document.querySelector('#prompt-textarea');
    const submitButton: HTMLButtonElement | null = document.querySelector('button[data-testid="fruitjuice-send-button"]');

    if (userPrompt && submitButton) {
      userPrompt.value = promptText;
      userPrompt.dispatchEvent(new InputEvent("input", { bubbles: true }));
      submitButton.click();
    } else {
      console.error("Failed to operate on ChatGPT");
    }
  }, 500);
};

const operateGemini = (promptText: string) => {
  setTimeout(() => {
    const userPrompt: HTMLParagraphElement | null  = document.querySelector('rich-textarea')?.querySelector('p') ?? null;
    const submitButton: HTMLButtonElement | null = document.querySelector('.send-button');

    if (userPrompt && submitButton) {
      userPrompt.textContent = promptText;
      // delay to submit
      setTimeout(() => {
        submitButton.click();
      }, 500);
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
    contexts: ["all"]
  });

  chrome.contextMenus.create({
    id: MENU_EXP1,
    parentId: MENU_ROOT,
    title: "ChatGPT test",
    contexts: ["all"]
  });
  chrome.contextMenus.create({
    id: MENU_EXP2,
    parentId: MENU_ROOT,
    title: "Gemini test",
    contexts: ["all"]
  });

}

chrome.runtime.onInstalled.addListener(updateContextMenus)
chrome.runtime.onStartup.addListener(updateContextMenus)
// chrome.storage.onChanged.addListener(updateContextMenus)

chrome.contextMenus.onClicked.addListener(((info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => {
  if (tab == null) {
    return
  }

  if (info.menuItemId === MENU_EXP1) {
    const selectedText = info.selectionText;

    chrome.tabs.create({ url: CHATGPT_URL }, (newTab: chrome.tabs.Tab) => {
      chrome.tabs.onUpdated.addListener(function listener(tabId: number, changeInfo) {
        if (tabId === newTab.id && changeInfo.status === "complete") {
          chrome.tabs.onUpdated.removeListener(listener);

          if (selectedText != null) {
            chrome.scripting.executeScript({
              target: { tabId: newTab.id },
              func: operateChatGPT,
              args: [selectedText],
            });
          }
        }
      });
    });
  }

  if (info.menuItemId === MENU_EXP2) {
    const selectedText = info.selectionText;

    chrome.tabs.create({ url: GEMINI_URL }, (newTab: chrome.tabs.Tab) => {
      chrome.tabs.onUpdated.addListener(function listener(tabId: number, changeInfo) {
        if (tabId === newTab.id && changeInfo.status === "complete") {
          chrome.tabs.onUpdated.removeListener(listener);

          if (selectedText != null) {
            chrome.scripting.executeScript({
              target: { tabId: newTab.id },
              func: operateGemini,
              args: [selectedText],
            });
          }
        }
      });
    });
  }
}));
