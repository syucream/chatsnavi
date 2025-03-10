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

/**
 * Claudeのプロンプト要素を取得する関数
 */
function getClaudePromptElement() {
  const promptContainer = document.querySelector(
    'div[aria-label="Write your prompt to Claude"]',
  );
  return promptContainer?.querySelector(
    'div.ProseMirror[contenteditable="true"]',
  );
}

/**
 * Claudeの送信ボタンをクリックする関数
 */
function clickClaudeSubmitButton() {
  const submitButton = document.querySelector<HTMLButtonElement>(
    'button[aria-label="Send Message"]',
  );
  submitButton?.click();
}

/**
 * Claudeのプロンプトにテキストを入力し、必要に応じて送信する関数
 */
function fillClaudePrompt(
  promptDiv: Element,
  text: string,
  autoSubmit: boolean,
) {
  // テキストを入力
  promptDiv.innerHTML = `<p>${text}</p>`;
  promptDiv.dispatchEvent(new InputEvent("input", { bubbles: true }));

  // キー入力イベントを発生させて送信ボタンを表示させる
  simulateKeyPressInClaude(promptDiv);

  // 自動送信が有効な場合
  if (autoSubmit) {
    setTimeout(() => {
      clickClaudeSubmitButton();
    }, 800); // 待機時間を少し長めに設定
  }
}

/**
 * Claudeのプロンプト入力と送信を処理する関数
 */
function handleClaude(text: string, autoSubmit: boolean) {
  const promptDiv = getClaudePromptElement();

  if (promptDiv) {
    fillClaudePrompt(promptDiv, text, autoSubmit);
  } else {
    console.log("Claude prompt div not found, retrying...");
    retryClaudePromptFill(text, autoSubmit);
  }
}

/**
 * Claudeのプロンプト入力を再試行する関数
 */
function retryClaudePromptFill(text: string, autoSubmit: boolean) {
  let attempts = 0;
  const maxAttempts = 10;

  const interval = setInterval(() => {
    attempts++;
    const promptDiv = getClaudePromptElement();

    if (promptDiv) {
      clearInterval(interval);
      fillClaudePrompt(promptDiv, text, autoSubmit);
    }

    if (attempts >= maxAttempts) {
      clearInterval(interval);
      console.log(
        "Failed to find Claude prompt div after",
        maxAttempts,
        "attempts",
      );
    }
  }, 500);
}

/**
 * Claudeのテキストエリアでキー入力をシミュレートする関数
 */
function simulateKeyPressInClaude(element: Element) {
  // スペースキーのキーダウンイベントを発生させる
  const keydownEvent = new KeyboardEvent("keydown", {
    key: " ",
    code: "Space",
    keyCode: 32,
    which: 32,
    bubbles: true,
    cancelable: true,
    composed: true,
    shiftKey: false,
    ctrlKey: false,
    altKey: false,
    metaKey: false,
  });
  element.dispatchEvent(keydownEvent);

  // スペースキーのキープレスイベントを発生させる
  const keypressEvent = new KeyboardEvent("keypress", {
    key: " ",
    code: "Space",
    keyCode: 32,
    which: 32,
    bubbles: true,
    cancelable: true,
    composed: true,
    shiftKey: false,
    ctrlKey: false,
    altKey: false,
    metaKey: false,
  });
  element.dispatchEvent(keypressEvent);

  // スペースキーのキーアップイベントを発生させる
  const keyupEvent = new KeyboardEvent("keyup", {
    key: " ",
    code: "Space",
    keyCode: 32,
    which: 32,
    bubbles: true,
    cancelable: true,
    composed: true,
    shiftKey: false,
    ctrlKey: false,
    altKey: false,
    metaKey: false,
  });
  element.dispatchEvent(keyupEvent);

  // バックスペースキーをシミュレートしてスペースを削除する
  setTimeout(() => {
    const backspaceEvent = new KeyboardEvent("keydown", {
      key: "Backspace",
      code: "Backspace",
      keyCode: 8,
      which: 8,
      bubbles: true,
      cancelable: true,
      composed: true,
      shiftKey: false,
      ctrlKey: false,
      altKey: false,
      metaKey: false,
    });
    element.dispatchEvent(backspaceEvent);
    element.dispatchEvent(
      new KeyboardEvent("keyup", {
        key: "Backspace",
        code: "Backspace",
        keyCode: 8,
        which: 8,
        bubbles: true,
        cancelable: true,
        composed: true,
      }),
    );
  }, 100);
}

export default defineContentScript({
  matches: [
    "https://chatgpt.com/*",
    "https://gemini.google.com/*",
    "https://claude.ai/*",
  ],
  main() {
    browser.runtime.onMessage.addListener((message: MessagePayload) => {
      if (message.type !== "FILL_PROMPT") return;
      if (message.target === "chatgpt") {
        handleChatGPT(message.text, message.autoSubmit);
      } else if (message.target === "gemini") {
        handleGemini(message.text, message.autoSubmit);
      } else if (message.target === "claude") {
        handleClaude(message.text, message.autoSubmit);
      }
    });
  },
});
