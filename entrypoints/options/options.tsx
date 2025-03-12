import React, { useEffect, useState } from "react";
import { storage } from "wxt/storage";
import "./globals.css";

// Import Shadcn/ui components
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Checkbox } from "./components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";

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

interface ClaudeSetting {
  name: string;
  autoSubmit: boolean;
  activate: boolean;
}

interface DeepSeekSetting {
  name: string;
  autoSubmit: boolean;
  activate: boolean;
}

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
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Auto Submit</TableHead>
          <TableHead>Open in New Tab</TableHead>
          <TableHead>GPT ID (e.g. g-XXXXXXXXX-hoge-fuga)</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {settings.map((setting, index) => (
          <TableRow key={index}>
            <TableCell>
              <Input
                type="text"
                value={setting.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />
            </TableCell>
            <TableCell>
              <Checkbox
                checked={setting.autoSubmit}
                onCheckedChange={(checked) =>
                  handleChange(index, "autoSubmit", checked === true)
                }
              />
            </TableCell>
            <TableCell>
              <Checkbox
                checked={setting.activate}
                onCheckedChange={(checked) =>
                  handleChange(index, "activate", checked === true)
                }
              />
            </TableCell>
            <TableCell>
              <Input
                type="text"
                value={setting.gpt ?? ""}
                onChange={(e) => handleChange(index, "gpt", e.target.value)}
              />
            </TableCell>
            <TableCell>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(index)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
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
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Auto Submit</TableHead>
          <TableHead>Open in New Tab</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {settings.map((setting, index) => (
          <TableRow key={index}>
            <TableCell>
              <Input
                type="text"
                value={setting.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />
            </TableCell>
            <TableCell>
              <Checkbox
                checked={setting.autoSubmit}
                onCheckedChange={(checked) =>
                  handleChange(index, "autoSubmit", checked === true)
                }
              />
            </TableCell>
            <TableCell>
              <Checkbox
                checked={setting.activate}
                onCheckedChange={(checked) =>
                  handleChange(index, "activate", checked === true)
                }
              />
            </TableCell>
            <TableCell>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(index)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const ClaudeSettingsTable: React.FC<{
  settings: ClaudeSetting[];
  onSettingsChange: (settings: ClaudeSetting[]) => void;
}> = ({ settings, onSettingsChange }) => {
  const handleDelete = (index: number) => {
    const newSettings = settings.filter((_, i) => i !== index);
    onSettingsChange(newSettings);
  };

  const handleChange = (
    index: number,
    field: keyof ClaudeSetting,
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
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Auto Submit</TableHead>
          <TableHead>Open in New Tab</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {settings.map((setting, index) => (
          <TableRow key={index}>
            <TableCell>
              <Input
                type="text"
                value={setting.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />
            </TableCell>
            <TableCell>
              <Checkbox
                checked={setting.autoSubmit}
                onCheckedChange={(checked) =>
                  handleChange(index, "autoSubmit", checked === true)
                }
              />
            </TableCell>
            <TableCell>
              <Checkbox
                checked={setting.activate}
                onCheckedChange={(checked) =>
                  handleChange(index, "activate", checked === true)
                }
              />
            </TableCell>
            <TableCell>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(index)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const DeepSeekSettingsTable: React.FC<{
  settings: DeepSeekSetting[];
  onSettingsChange: (settings: DeepSeekSetting[]) => void;
}> = ({ settings, onSettingsChange }) => {
  const handleDelete = (index: number) => {
    const newSettings = settings.filter((_, i) => i !== index);
    onSettingsChange(newSettings);
  };

  const handleChange = (
    index: number,
    field: keyof DeepSeekSetting,
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
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Auto Submit</TableHead>
          <TableHead>Open in New Tab</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {settings.map((setting, index) => (
          <TableRow key={index}>
            <TableCell>
              <Input
                type="text"
                value={setting.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />
            </TableCell>
            <TableCell>
              <Checkbox
                checked={setting.autoSubmit}
                onCheckedChange={(checked) =>
                  handleChange(index, "autoSubmit", checked === true)
                }
              />
            </TableCell>
            <TableCell>
              <Checkbox
                checked={setting.activate}
                onCheckedChange={(checked) =>
                  handleChange(index, "activate", checked === true)
                }
              />
            </TableCell>
            <TableCell>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(index)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export const Options: React.FC = () => {
  const [chatGPTSettings, setChatGPTSettings] = useState<ChatGPTSetting[]>([]);
  const [geminiSettings, setGeminiSettings] = useState<GeminiSetting[]>([]);
  const [claudeSettings, setClaudeSettings] = useState<ClaudeSetting[]>([]);
  const [deepSeekSettings, setDeepSeekSettings] = useState<DeepSeekSetting[]>(
    [],
  );

  useEffect(() => {
    storage
      .getItems([
        "local:chatGPTSettings",
        "local:geminiSettings",
        "local:claudeSettings",
        "local:deepSeekSettings",
      ])
      .then((items) => {
        items.forEach(({ key, value }) => {
          if (key === "local:chatGPTSettings" && value != null) {
            setChatGPTSettings(value);
          }
          if (key === "local:geminiSettings" && value != null) {
            setGeminiSettings(value);
          }
          if (key === "local:claudeSettings" && value != null) {
            setClaudeSettings(value);
          }
          if (key === "local:deepSeekSettings" && value != null) {
            setDeepSeekSettings(value);
          }
        });
      });
  }, []);

  const handleSave = () => {
    storage.setItems([
      { key: "local:chatGPTSettings", value: chatGPTSettings },
      { key: "local:geminiSettings", value: geminiSettings },
      { key: "local:claudeSettings", value: claudeSettings },
      { key: "local:deepSeekSettings", value: deepSeekSettings },
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

  const handleAppendClaude = () => {
    setClaudeSettings([
      ...claudeSettings,
      { name: "", autoSubmit: false, activate: false },
    ]);
  };

  const handleAppendDeepSeek = () => {
    setDeepSeekSettings([
      ...deepSeekSettings,
      { name: "", autoSubmit: false, activate: false },
    ]);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-4xl space-y-6">
        <Card className="border-none shadow-md">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="text-2xl">ChatsNavi Settings</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Manage settings for each AI chat service
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="chatgpt" className="w-full">
              <TabsList className="mb-4 w-full justify-start">
                <TabsTrigger value="chatgpt">ChatGPT</TabsTrigger>
                <TabsTrigger value="gemini">Gemini</TabsTrigger>
                <TabsTrigger value="claude">Claude</TabsTrigger>
                <TabsTrigger value="deepseek">DeepSeek</TabsTrigger>
              </TabsList>

              <TabsContent value="chatgpt" className="space-y-4">
                <ChatGPTSettingsTable
                  settings={chatGPTSettings}
                  onSettingsChange={setChatGPTSettings}
                />
                <Button
                  onClick={handleAppendChatGPT}
                  variant="outline"
                  className="mt-2"
                >
                  Add ChatGPT Setting
                </Button>
              </TabsContent>

              <TabsContent value="gemini" className="space-y-4">
                <GeminiSettingsTable
                  settings={geminiSettings}
                  onSettingsChange={setGeminiSettings}
                />
                <Button
                  onClick={handleAppendGemini}
                  variant="outline"
                  className="mt-2"
                >
                  Add Gemini Setting
                </Button>
              </TabsContent>

              <TabsContent value="claude" className="space-y-4">
                <ClaudeSettingsTable
                  settings={claudeSettings}
                  onSettingsChange={setClaudeSettings}
                />
                <Button
                  onClick={handleAppendClaude}
                  variant="outline"
                  className="mt-2"
                >
                  Add Claude Setting
                </Button>
              </TabsContent>

              <TabsContent value="deepseek" className="space-y-4">
                <DeepSeekSettingsTable
                  settings={deepSeekSettings}
                  onSettingsChange={setDeepSeekSettings}
                />
                <Button
                  onClick={handleAppendDeepSeek}
                  variant="outline"
                  className="mt-2"
                >
                  Add DeepSeek Setting
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="bg-muted/20 p-6 flex justify-end">
            <Button onClick={handleSave} className="w-full sm:w-auto">
              Save
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
