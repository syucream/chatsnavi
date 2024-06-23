interface ChatGPTSetting {
  name: string;
  autoSubmit: boolean;
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
    const deleteCell = row.insertCell(2);

    nameCell.innerHTML = `<input type="text" value="${chatGPTSettings.name}">`;
    autoSubmitCell.innerHTML = `<input type="checkbox" ${chatGPTSettings.autoSubmit ? "checked" : ""}>`;
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
      appendRow(chatGPTSettingsBody, { name: "", autoSubmit: false });
    });
};

document.addEventListener("DOMContentLoaded", function () {
  const chatGPTSettingsBody = document
    .getElementById("chatGPTSettings")
    ?.getElementsByTagName("tbody")[0];
  const saveButton = document.getElementById("save");

  if (chatGPTSettingsBody && saveButton) {
    addChatGPTSettingsEventListeners(chatGPTSettingsBody);

    saveButton.addEventListener("click", () => {
      const chatGPTSettings: ChatGPTSetting[] = [];
      for (let i = 0; i < chatGPTSettingsBody.rows.length; i++) {
        const row = chatGPTSettingsBody.rows[i];
        const name = (
          row.cells[0].getElementsByTagName("input")[0] as HTMLInputElement
        ).value;
        const autoSubmit = (
          row.cells[1].getElementsByTagName("input")[0] as HTMLInputElement
        ).checked;
        chatGPTSettings.push({ name, autoSubmit });
      }

      // TODO gemini

      chrome.storage.local.set({ chatGPTSettings }, () => {});
    });
  }
});
