"use client";

import React, { useState, useEffect } from "react";
import { getAIModelsSettings, updateModalSetings } from "@/service/chat";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useModelStore } from "@/store/modelStore";

export default function SettingsModal({ onClose }: { onClose: () => void }) {
  const [models, setModels] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [maxToken, setMaxToken] = useState("");
  const [initialContent, setInitialContent] = useState("");
  const [initialMaxToken, setInitialMaxToken] = useState("");

  const selected = models.find((m) => m.id === selectedModel);
  const setContent = useModelStore((state) => state.setContent);
  const setModel = useModelStore((state) => state.setModel);

  console.log("=== SettingsModal Debug ===");
  console.log("setContent function:", setContent);
  console.log("setModel function:", setModel);

  useEffect(() => {
    getAIModelsSettings().then((res) => {
      console.log("Models loaded:", res?.data);
      if (res?.data) setModels(res.data);
    });
  }, []);

  useEffect(() => {
    if (selected) {
      const content = selected.content || "";
      const maxToken = selected.maxTokens || "";

      console.log("Setting notes to:", content);
      console.log("Setting maxToken to:", maxToken);

      setNotes(content);
      setMaxToken(maxToken);

      setModel(selected.id);
      setContent(content);

      // save initial value
      setInitialContent(content);
      setInitialMaxToken(maxToken);
    }
  }, [selectedModel, models, setModel, setContent]);

  const handleSave = async () => {
    if (!selectedModel || !selected) return;

    const updatedModel = {
      ...selected,
      name: selected.name,
      maxTokens: Number(maxToken),
      content: notes,
    };

    console.log("Saving model:", updatedModel);

    await updateModalSetings(updatedModel);

    // Store update:
    setModel(updatedModel.id);
    setContent(updatedModel.content);

    setModels((prevModels) =>
      prevModels.map((model) =>
        model.id === selectedModel ? updatedModel : model
      )
    );
         
    setModel(updatedModel.id);

    setInitialContent(notes);
    setInitialMaxToken(maxToken);
  };

  const modelName = selected?.name;
  const isChanged = notes !== initialContent || maxToken !== initialMaxToken;

  return (
    <div className="fixed px-5 inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-999">
      <div className="bg-[var(--chatArea)] text-[var(--foreground)] rounded-lg shadow-xl w-full max-w-4xl h-[500px] flex overflow-hidden border border-[var(--border)]">
        <aside className="w-1/3 bg-[var(--background)] p-4 border-r border-[var(--border)] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">AI Models</h2>
          <ul className="space-y-2">
            {models.length > 0 ? (
              models.map((modelItem) => (
                <li key={modelItem.id}>
                  <button
                    onClick={() => setSelectedModel(modelItem.id)}
                    className={`w-full text-left px-4 py-2 rounded-md transition cursor-pointer ${
                      selectedModel === modelItem.id
                        ? "bg-[var(--border)] font-semibold"
                        : "hover:bg-[var(--accent)]"
                    }`}
                  >
                    {modelItem.name}
                  </button>
                </li>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-muted-foreground">
                Model not available
              </div>
            )}
          </ul>
        </aside>

        {/* Content */}
        <div className="flex-1 p-4 relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
          >
            <Icon
              icon="solar:close-circle-bold"
              className="h-7 w-7 cursor-pointer"
            />
          </button>

          {selectedModel ? (
            <div>
              <h3 className="text-lg font-medium mb-2">
                Settings: <span className="text-blue-600">{modelName}</span>
              </h3>
              {/* Max Token + Textarea */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <label htmlFor="maxToken" className="whitespace-nowrap ">
                    Max Token:
                  </label>
                  <Input
                    value={maxToken}
                    onChange={(e) => setMaxToken(e.target.value)}
                    type="number"
                    id="maxToken"
                    placeholder="Enter max token"
                    className="max-w-[200px]"
                  />
                </div>

                <textarea
                  className="w-full h-[300px] bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-md p-3 resize-none outline-none"
                  placeholder="Write notes, configuration or description here..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <Button
                onClick={handleSave}
                disabled={!isChanged}
                className={
                  isChanged
                    ? "bg-[#4053CA] text-white hover:bg-[#3547b5] cursor-pointer"
                    : "opacity-50 cursor-not-allowed"
                }
              >
                Save
              </Button>
            </div>
          ) : (
            <div className="text-gray-400 italic mt-20 text-center">
              Select a model from the left to configure.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
