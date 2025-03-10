import type { MessagePayload } from "./background";

console.log("ChatsNavi content script loaded");

/**
 * ChatGPTのプロンプト入力と送信を処理する関数
 */
function handleChatGPT(text: string, autoSubmit: boolean) {
  const promptDiv = document.querySelector<HTMLDivElement>("#prompt-textarea");

  if (promptDiv) {
    fillChatGPTPrompt(promptDiv, text, autoSubmit);
  } else {
    console.log("Prompt div not found, retrying...");
    retryChatGPTPromptFill(text, autoSubmit);
  }
}

/**
 * ChatGPTのプロンプトにテキストを入力し、必要に応じて送信する
 */
function fillChatGPTPrompt(
  promptDiv: HTMLDivElement,
  text: string,
  autoSubmit: boolean,
) {
  promptDiv.innerHTML = `<p>${text}</p>`;
  promptDiv.dispatchEvent(new InputEvent("input", { bubbles: true }));

  if (autoSubmit) {
    setTimeout(() => {
      clickChatGPTSubmitButton();
    }, 500);
  }
}

/**
 * ChatGPTの送信ボタンを探して押す関数
 */
function clickChatGPTSubmitButton() {
  const submitButton =
    document.querySelector<HTMLButtonElement>(
      'button[data-testid="send-button"]',
    ) ||
    document.querySelector<HTMLButtonElement>(
      'button[aria-label="プロンプトを送信する"]',
    ) ||
    document.querySelector<HTMLButtonElement>(".send-button");

  if (submitButton) {
    submitButton.click();
  }
}

/**
 * ChatGPTのプロンプト入力を再試行する関数
 */
function retryChatGPTPromptFill(text: string, autoSubmit: boolean) {
  let attempts = 0;
  const maxAttempts = 10;

  const interval = setInterval(() => {
    attempts++;
    const promptDiv =
      document.querySelector<HTMLDivElement>("#prompt-textarea");

    if (promptDiv) {
      clearInterval(interval);
      promptDiv.innerHTML = `<p>${text}</p>`;
      promptDiv.dispatchEvent(new InputEvent("input", { bubbles: true }));

      if (autoSubmit) {
        setTimeout(() => {
          clickChatGPTSubmitButton();
        }, 500);
      }
    }

    if (attempts >= maxAttempts) {
      clearInterval(interval);
    }
  }, 500);
}

/**
 * Geminiのプロンプト入力と送信を処理する関数
 */
function handleGemini(text: string, autoSubmit: boolean) {
  const richTextarea = document.querySelector("rich-textarea");
  const paragraph = richTextarea?.querySelector<HTMLParagraphElement>("p");

  if (paragraph) {
    paragraph.textContent = text;

    if (autoSubmit) {
      const submitButton =
        document.querySelector<HTMLButtonElement>(".send-button");
      setTimeout(() => {
        submitButton?.click();
      }, 500);
    }
  }
}

export default defineContentScript({
  matches: ["https://chatgpt.com/*", "https://gemini.google.com/*"],
  main() {
    browser.runtime.onMessage.addListener((message: MessagePayload) => {
      if (message.type !== "FILL_PROMPT") return;
      if (message.target === "chatgpt") {
        handleChatGPT(message.text, message.autoSubmit);
      } else if (message.target === "gemini") {
        handleGemini(message.text, message.autoSubmit);
      }
    });
  },
});
