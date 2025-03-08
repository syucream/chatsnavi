import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { storage } from "wxt/storage";

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

const Container = styled.div`
  width: 700px;
  height: 600px;
`;

const Table = styled.table`
  width: 100%;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  &[type="text"] {
    min-width: 300px;
  }
`;

const ChatGPTSettingsTable: React.FC<{
  settings: ChatGPTSetting[];
  onSettingsChange: (settings: ChatGPTSetting[]) => void;
}> = ({ settings, onSettingsChange }) => {
  const handleDelete = (index: number) => {
    const newSettings = settings.filter((_, i) => i !== index);
    onSettingsChange(newSettings);
  };

  const handleChange = (
    index: number,
    field: keyof ChatGPTSetting,
    value: string | boolean,
  ) => {
    const newSettings = settings.map((setting, i) => {
      if (i === index) {
        return { ...setting, [field]: value };
      }
      return setting;
    });
    onSettingsChange(newSettings);
  };

  return (
    <Table>
      <thead>
        <tr>
          <th>name</th>
          <th>auto-submit</th>
          <th>activate a new tab</th>
          <th>GPT id (e.g. g-XXXXXXXXX-hoge-fuga)</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {settings.map((setting, index) => (
          <tr key={index}>
            <td>
              <Input
                type="text"
                value={setting.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={setting.autoSubmit}
                onChange={(e) =>
                  handleChange(index, "autoSubmit", e.target.checked)
                }
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={setting.activate}
                onChange={(e) =>
                  handleChange(index, "activate", e.target.checked)
                }
              />
            </td>
            <td>
              <Input
                type="text"
                value={setting.gpt ?? ""}
                onChange={(e) => handleChange(index, "gpt", e.target.value)}
              />
            </td>
            <td>
              <button onClick={() => handleDelete(index)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

const GeminiSettingsTable: React.FC<{
  settings: GeminiSetting[];
  onSettingsChange: (settings: GeminiSetting[]) => void;
}> = ({ settings, onSettingsChange }) => {
  const handleDelete = (index: number) => {
    const newSettings = settings.filter((_, i) => i !== index);
    onSettingsChange(newSettings);
  };

  const handleChange = (
    index: number,
    field: keyof GeminiSetting,
    value: string | boolean,
  ) => {
    const newSettings = settings.map((setting, i) => {
      if (i === index) {
        return { ...setting, [field]: value };
      }
      return setting;
    });
    onSettingsChange(newSettings);
  };

  return (
    <Table>
      <thead>
        <tr>
          <th>name</th>
          <th>auto-submit</th>
          <th>activate a new tab</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {settings.map((setting, index) => (
          <tr key={index}>
            <td>
              <Input
                type="text"
                value={setting.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={setting.autoSubmit}
                onChange={(e) =>
                  handleChange(index, "autoSubmit", e.target.checked)
                }
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={setting.activate}
                onChange={(e) =>
                  handleChange(index, "activate", e.target.checked)
                }
              />
            </td>
            <td>
              <button onClick={() => handleDelete(index)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export const Options: React.FC = () => {
  const [chatGPTSettings, setChatGPTSettings] = useState<ChatGPTSetting[]>([]);
  const [geminiSettings, setGeminiSettings] = useState<GeminiSetting[]>([]);

  useEffect(() => {
    storage
      .getItems(["local:chatGPTSettings", "local:geminiSettings"])
      .then((items) => {
        items.forEach(({ key, value }) => {
          if (key === "local:chatGPTSettings" && value != null) {
            setChatGPTSettings(value);
          }
          if (key === "local:geminiSettings" && value != null) {
            setGeminiSettings(value);
          }
        });
      });
  }, []);

  const handleSave = () => {
    storage.setItems([
      { key: "local:chatGPTSettings", value: chatGPTSettings },
      { key: "local:geminiSettings", value: geminiSettings },
    ]);
  };

  const handleAppendChatGPT = () => {
    setChatGPTSettings([
      ...chatGPTSettings,
      { name: "", autoSubmit: false, activate: false },
    ]);
  };

  const handleAppendGemini = () => {
    setGeminiSettings([
      ...geminiSettings,
      { name: "", autoSubmit: false, activate: false },
    ]);
  };

  return (
    <Container>
      <h1>ChatsNavi Options</h1>

      <div>
        <h2>ChatGPT settings</h2>
        <div>
          <ChatGPTSettingsTable
            settings={chatGPTSettings}
            onSettingsChange={setChatGPTSettings}
          />
          <button onClick={handleAppendChatGPT}>
            Append a new ChatGPT setting
          </button>
        </div>

        <h2>Gemini settings</h2>
        <div>
          <GeminiSettingsTable
            settings={geminiSettings}
            onSettingsChange={setGeminiSettings}
          />
          <button onClick={handleAppendGemini}>
            Append a new Gemini setting
          </button>
        </div>
      </div>

      <button onClick={handleSave}>Save</button>
    </Container>
  );
};
