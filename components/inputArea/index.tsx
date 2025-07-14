"use client";

import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { useModelStore } from "@/store/modelStore";
import Image from "next/image";
import { Button } from "../ui/button";

interface Props {
  onSend: (
    message:
      | string
      | {
          content: {
            type: "text" | "image_url";
            text?: string;
            image_url?: { url: string };
          }[];
        },
    getAnswer: (cb: (answer: string) => void) => void,
    conversationId?: string
  ) => void;
  conversationId?: string;
}

export default function InputArea({ onSend, conversationId }: Props) {
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const [uploadedFile, setUploadedFile] = useState<
    { name: string; base64: string }[]
  >([]);
  const contentRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const model = useModelStore((s) => s.model);
  const thinkEnabled = useModelStore((s) => s.thinkEnabled);
  const setThinkEnabled = useModelStore((s) => s.setThinkEnabled);
  const hasUsedNoThink = useModelStore((s) => s.hasUsedNoThink);
  const setHasUsedNoThink = useModelStore((s) => s.setHasUsedNoThink);

  const handleInput = () => {
    if (contentRef.current) {
      setMessage(contentRef.current.innerText);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: { name: string; base64: string }[] = [];
    const fileReaders: Promise<void>[] = [];

    Array.from(files)
      .slice(0, 3 - uploadedFile.length) // 3 tagacha
      .forEach((file) => {
        fileReaders.push(
          new Promise<void>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              newFiles.push({
                name: file.name,
                base64: reader.result as string,
              });
              resolve();
            };
            reader.readAsDataURL(file);
          })
        );
      });

    Promise.all(fileReaders).then(() => {
      setUploadedFile((prev) => [...prev, ...newFiles]);
    });
  };

  const supportsFile = model === "devstral";

  const handleSend = () => {
    const isEmpty = !message.trim() && uploadedFile.length === 0;
    if (isEmpty) return;

    let payload:
      | string
      | {
          content: {
            type: "text" | "image_url";
            text?: string;
            image_url?: { url: string };
          }[];
        };

    if (
      supportsFile &&
      uploadedFile.length > 0 &&
      uploadedFile[0].base64.startsWith("data:image")
    ) {
      const contentArr: {
        type: "text" | "image_url";
        text?: string;
        image_url?: { url: string };
      }[] = [];

      uploadedFile.forEach((file) => {
        if (file.base64.startsWith("data:image")) {
          contentArr.push({
            type: "image_url",
            image_url: { url: file.base64 },
          });
        }
      });

      if (message.trim()) {
        contentArr.push({ type: "text", text: message });
      }
      payload = { content: contentArr };
    } else {
      let modifiedMessage = message;
      if (thinkEnabled && model === "qwen3" && !hasUsedNoThink) {
        modifiedMessage = `/no_think/${modifiedMessage}`;
        setHasUsedNoThink(true);
      }
      payload = modifiedMessage;
    }

    onSend(payload, () => {});

    setMessage("");
    setUploadedFile([]);
    if (contentRef.current) {
      contentRef.current.innerText = "";
    }
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
      <div className="flex flex-col border rounded-xl p-3 gap-1 bg-[var(--inputArea)] border-[var(--border)]">
        {/* Uploaded file preview */}
        <div className="flex">
          {uploadedFile.map((file, index) => (
            <div key={index} className="relative w-[50] flex-shrink-0 m-2">
              <Image
                src={file.base64}
                alt={`image_${index}`}
                width={50}
                height={50}
                className="rounded"
                unoptimized
              />
              <div
                className="absolute top-0 right-0 cursor-pointer"
                onClick={() =>
                  setUploadedFile((prev) => prev.filter((_, i) => i !== index))
                }
              >
                <Icon icon="solar:close-circle-linear" className="h-5 w-5" />
              </div>
            </div>
          ))}
        </div>

        {/* Editable Input */}
        <div className="max-h-[200px] w-full overflow-x-auto">
          <div
            ref={contentRef}
            contentEditable
            className="w-full outline-none text-[var(--foreground)] text-sm px-2 placeholder-gray-400"
            onInput={handleInput}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            suppressContentEditableWarning={true}
          ></div>
        </div>

        <div className="flex justify-between items-center">
          {/* Menu plus Button */}
          <div className="relative" ref={menuRef}>
            <button
              className="p-1 rounded-full text-gray-400 hover:bg-[var(--border)] transition cursor-pointer"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <Icon icon="mdi:plus" className="h-5 w-5" />
            </button>
            {menuOpen && (
              <div className="absolute bottom-full mb-2 py-0 left-0 z-10 bg-[var(--inputArea)] border border-gray-700 rounded-md shadow-lg w-44 text-sm text-white">
                
                <div className="flex items-center justify-between px-4 py-2 hover:bg-gray-700 cursor-pointer">
                  <Label htmlFor="thinking-switch" className="cursor-pointer">
                    Thinking
                  </Label>
                  <Switch
                    id="thinking-switch"
                    checked={thinkEnabled}
                    onCheckedChange={setThinkEnabled}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex">
            {/* File upload  */}
            {supportsFile && (
              <label className="p-1 rounded-full text-gray-400 hover:bg-[var(--border)] transition cursor-pointer">
                <Icon icon="mdi:paperclip" className="h-5 w-5" />
                <input
                  type="file"
                  accept="image/*,.pdf,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}

            {/* Microphone */}
            <button
              className="p-1 rounded-full text-gray-400 hover:bg-[var(--border)] transition cursor-pointer"
              title="Ovozli kiritish"
              onClick={() => alert("Ovozli kiritish hali qo‘shilmagan!")}
            >
              <Icon icon={"mdi:microphone-outline"} className="h-5 w-5" />
            </button>

            {/* Send */}
            <button
              className="py-1 px-2 rounded-sm text-white transition disabled:opacity-30 bg-[var(--sendChatBg)] cursor-pointer"
              title="Yuborish"
              disabled={!message.trim() && uploadedFile.length === 0}
              onClick={handleSend}
            >
              <Icon
                icon={"material-symbols:send-rounded"}
                className="h-5 w-5"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
