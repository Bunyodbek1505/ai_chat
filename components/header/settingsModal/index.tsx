"use client";

import React, { useState, useEffect } from "react";
import { getAIModels } from "@/service/chat";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

export default function SettingsModal({ onClose }: { onClose: () => void }) {
  const [models, setModels] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    getAIModels().then((res) => {
      if (res?.data) setModels(res.data);
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[var(--chatArea)] text-[var(--foreground)] rounded-lg shadow-xl w-full max-w-4xl h-[500px] flex overflow-hidden border border-[var(--border)]">
        {/* Sidebar */}
        <aside className="w-1/3 bg-[var(--background)] p-4 border-r border-[var(--border)] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">AI Models</h2>
          <ul className="space-y-2">
            {models.map((modelItem) => (
              <li key={modelItem.id}>
                <button
                  onClick={() => setSelectedModel(modelItem.id)}
                  className={`w-full text-left px-4 py-2 rounded-md transition ${
                    selectedModel === modelItem.id
                      ? "bg-[var(--border)] font-semibold"
                      : "hover:bg-[var(--border)]"
                  }`}
                >
                  {modelItem.id}
                </button>
              </li>
            ))}
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
                Settings:{" "}
                <span className="text-blue-600"> {selectedModel}</span>
              </h3>
              <textarea
                className="w-full h-[300px] bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] rounded-md p-3 resize-none outline-none"
                placeholder="Write notes, configuration or description here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <Button
                variant={notes ? undefined : "outline"}
                className={
                  notes ? "bg-[#4053CA] text-white hover:bg-[#3547b5]" : ""
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
