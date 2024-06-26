interface ChatGPTSetting {
  name: string;
  autoSubmit: boolean;
  activate: boolean;
  gpt?: string;
}
interface GeminiSetting {
  name: string;
  autoSubmit: boolean;
  activate: boolean;
}

const addChatGPTSettingsEventListeners = (
  chatGPTSettingsBody: HTMLTableSectionElement,
) => {
  const appendRow = (
    element: HTMLTableSectionElement,
    chatGPTSettings: ChatGPTSetting,
  ) => {
    const row = element.insertRow();
    const nameCell = row.insertCell(0);
    const autoSubmitCell = row.insertCell(1);
    const activateCell = row.insertCell(2);
    const gptCell = row.insertCell(3);
    const deleteCell = row.insertCell(4);

    nameCell.innerHTML = `<input type="text" value="${chatGPTSettings.name}">`;
    autoSubmitCell.innerHTML = `<input type="checkbox" ${chatGPTSettings.autoSubmit ? "checked" : ""}>`;
    activateCell.innerHTML = `<input type="checkbox" ${chatGPTSettings.activate ? "checked" : ""}>`;
    gptCell.innerHTML = `<input type="text" value="${chatGPTSettings.gpt ?? ""}">`;
    deleteCell.innerHTML = `<button class="deleteRow">Delete</button>`;

    deleteCell.addEventListener("click", () => {
      element.deleteRow(row.rowIndex - 1);
    });
  };

  chrome.storage.local.get("chatGPTSettings", (items) => {
    if (chatGPTSettingsBody && items.chatGPTSettings) {
      (items as { chatGPTSettings: ChatGPTSetting[] }).chatGPTSettings.forEach(
        (setting) => {
          appendRow(chatGPTSettingsBody, setting);
        },
      );
    }
  });

  document
    .getElementById("appendChatGPTSetting")
    ?.addEventListener("click", () => {
      appendRow(chatGPTSettingsBody, {
        name: "",
        autoSubmit: false,
        activate: false,
      });
    });
};

const addGeminiSettingsEventListeners = (
  geminiSettingsBody: HTMLTableSectionElement,
) => {
  const appendRow = (
    element: HTMLTableSectionElement,
    setting: GeminiSetting,
  ) => {
    const row = element.insertRow();
    const nameCell = row.insertCell(0);
    const autoSubmitCell = row.insertCell(1);
    const activateCell = row.insertCell(2);
    const deleteCell = row.insertCell(3);

    nameCell.innerHTML = `<input type="text" value="${setting.name}">`;
    autoSubmitCell.innerHTML = `<input type="checkbox" ${setting.autoSubmit ? "checked" : ""}>`;
    activateCell.innerHTML = `<input type="checkbox" ${setting.activate ? "checked" : ""}>`;
    deleteCell.innerHTML = `<button class="deleteRow">Delete</button>`;

    deleteCell.addEventListener("click", () => {
      element.deleteRow(row.rowIndex - 1);
    });
  };

  chrome.storage.local.get("geminiSettings", (items) => {
    if (geminiSettingsBody && items.geminiSettings) {
      (items as { geminiSettings: GeminiSetting[] }).geminiSettings.forEach(
        (setting) => {
          appendRow(geminiSettingsBody, setting);
        },
      );
    }
  });

  document
    .getElementById("appendGeminiSetting")
    ?.addEventListener("click", () => {
      appendRow(geminiSettingsBody, {
        name: "",
        autoSubmit: false,
        activate: false,
      });
    });
};

document.addEventListener("DOMContentLoaded", function () {
  const chatGPTSettingsBody = document
    .getElementById("chatGPTSettings")
    ?.getElementsByTagName("tbody")[0];
  const geminiSettingsBody = document
    .getElementById("geminiSettings")
    ?.getElementsByTagName("tbody")[0];
  const saveButton = document.getElementById("save");

  if (chatGPTSettingsBody && geminiSettingsBody && saveButton) {
    addChatGPTSettingsEventListeners(chatGPTSettingsBody);
    addGeminiSettingsEventListeners(geminiSettingsBody);

    saveButton.addEventListener("click", () => {
      // ChatGPT
      const chatGPTSettings: ChatGPTSetting[] = [];
      for (let i = 0; i < chatGPTSettingsBody.rows.length; i++) {
        const row = chatGPTSettingsBody.rows[i];
        const name = (
          row.cells[0].getElementsByTagName("input")[0] as HTMLInputElement
        ).value;
        const autoSubmit = (
          row.cells[1].getElementsByTagName("input")[0] as HTMLInputElement
        ).checked;
        const activate = (
          row.cells[2].getElementsByTagName("input")[0] as HTMLInputElement
        ).checked;
        const gpt = (
          row.cells[3].getElementsByTagName("input")[0] as HTMLInputElement
        ).value;
        chatGPTSettings.push({
          name,
          autoSubmit,
          activate,
          gpt: gpt.length > 0 ? gpt : undefined,
        });
      }

      // Gemini
      const geminiSettings: GeminiSetting[] = [];
      for (let i = 0; i < geminiSettingsBody.rows.length; i++) {
        const row = geminiSettingsBody.rows[i];
        const name = (
          row.cells[0].getElementsByTagName("input")[0] as HTMLInputElement
        ).value;
        const autoSubmit = (
          row.cells[1].getElementsByTagName("input")[0] as HTMLInputElement
        ).checked;
        const activate = (
          row.cells[2].getElementsByTagName("input")[0] as HTMLInputElement
        ).checked;
        geminiSettings.push({
          name,
          autoSubmit,
          activate,
        });
      }

      chrome.storage.local.set({ chatGPTSettings, geminiSettings }, () => {});
    });
  }
});
