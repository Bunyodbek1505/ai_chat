// components/InputArea.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useModelStore } from "@/store/modelStore";
import UploadedFilesPreview from "./uploadedFilesPreview/UploadedFilesPreview";
import MessageInput from "./messageInput/MessageInput";
import InputToolsMenu from "./inputToolsMenu";

type MessageContent =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "image_url";
      image_url: { url: string };
    };

interface Props {
  onSend: (message: string | { content: MessageContent[] }) => void;
}

export default function InputArea({ onSend }: Props) {
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<
    { name: string; base64: string }[]
  >([]);
  const [uploadedFolder, setUploadedFolder] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const model = useModelStore((s) => s.model);
  const thinkEnabled = useModelStore((s) => s.thinkEnabled);
  const hasUsedNoThink = useModelStore((s) => s.hasUsedNoThink);
  const setHasUsedNoThink = useModelStore((s) => s.setHasUsedNoThink);

  const supportsFile = model === "devstral";

  const readFilesAsBase64 = async (files: FileList) => {
    const max = 3 - uploadedFile.length;
    const limited = Array.from(files).slice(0, max);

    const base64Files = await Promise.all(
      limited.map(
        (file) =>
          new Promise<{ name: string; base64: string }>((resolve) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({ name: file.name, base64: reader.result as string });
            reader.readAsDataURL(file);
          })
      )
    );

    setUploadedFile((prev) => [...prev, ...base64Files]);
  };

  const handleSend = () => {
    if (!message.trim() && uploadedFile.length === 0) return;

    let payload: string | { content: MessageContent[] };

    if (supportsFile && uploadedFile.length) {
      const contentArr: MessageContent[] = uploadedFile.map((f) => ({
        type: "image_url" as const,
        image_url: { url: f.base64 },
      }));

      if (message.trim()) {
        contentArr.push({
          type: "text",
          text: message,
        });
      }

      payload = { content: contentArr };
    } else {
      let modified = message;
      if (thinkEnabled && model === "qwen3" && !hasUsedNoThink) {
        modified = `/no_think/${modified}`;
        setHasUsedNoThink(true);
      }
      payload = modified;
    }

    onSend(payload);
    setMessage("");
    setUploadedFile([]);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <div className="flex flex-col border rounded-xl pb-1 gap-2 bg-[var(--inputArea)] border-[var(--border)]">
        <UploadedFilesPreview
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
          uploadedFolder={uploadedFolder}
          setUploadedFolder={setUploadedFolder}
        />

        <MessageInput
          value={message}
          onChange={setMessage}
          onEnter={handleSend}
        />

        <div className="flex justify-between items-center">
          {/* Tools menu */}
          <div className="relative" ref={menuRef}>
            <button
              className="p-1 rounded-full text-gray-400 hover:bg-[var(--border)]"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <Icon icon="mdi:plus" className="h-5 w-5" />
            </button>

            {menuOpen && (
              <InputToolsMenu
                onFolderSelected={(folderName) => setUploadedFolder(folderName)}
                onFilesSelected={readFilesAsBase64}
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            {supportsFile && (
              <label className="p-1 cursor-pointer text-gray-400 hover:bg-[var(--border)] rounded-full">
                <Icon icon="mdi:paperclip" className="h-5 w-5" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files && readFilesAsBase64(e.target.files)
                  }
                />
              </label>
            )}
            <button
              onClick={handleSend}
              disabled={!message.trim() && uploadedFile.length === 0}
              className="py-1 px-3 bg-[var(--sendChatBg)] text-white rounded-sm disabled:opacity-30"
            >
              <Icon icon="material-symbols:send-rounded" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
