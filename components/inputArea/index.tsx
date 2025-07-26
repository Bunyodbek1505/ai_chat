"use client";

import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useModelStore } from "@/store/modelStore";
import UploadedFilesPreview from "./uploadedFilesPreview/UploadedFilesPreview";
import MessageInput from "./messageInput/MessageInput";
import InputToolsMenu from "./inputToolsMenu";
import dynamic from "next/dynamic";
import VoiceChat from "./voiceChat";

// const DynamicVoiceChat = dynamic(
//   () => import("@/components/inputArea/voiceChat"), // To'g'ri yo'lni ko'rsating
//   {
//     ssr: false,
//     // (Ixtiyoriy) Komponent yuklanayotganda ko'rsatiladigan narsa
//     loading: () => <p className="text-white">Ovozli chat yuklanmoqda...</p>,
//   }
// );

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
  const [voiceChatOpen, setVoiceChatOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<
    { name: string; base64: string }[]
  >([]);
  const [uploadedFolder, setUploadedFolder] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const model = useModelStore((s) => s.model);
  const thinkEnabled = useModelStore((s) => s.thinkEnabled);
  const hasUsedNoThink = useModelStore((s) => s.hasUsedNoThink);
  const setHasUsedNoThink = useModelStore((s) => s.setHasUsedNoThink);

  const supportsFile = model === "";

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

  // Voice Chat uchun ovoz xabarini yuborish
  const handleSendVoiceMessage = (audioBlob: Blob) => {
    const payload = {
      content: [
        {
          type: "audio" as const,
          audio: audioBlob,
        },
      ],
    };
    // onSend(payload);
    setVoiceChatOpen(false);
  };

  // Voice Chat ochish
  const handleOpenVoiceChat = () => {
    setVoiceChatOpen(true);
  };

  // Voice Chat yopish
  const handleCloseVoiceChat = () => {
    setVoiceChatOpen(false);
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
    <>
      <div className="relative">
        <div className="flex flex-col border-4 rounded-2xl pb-1 gap-2 bg-[var(--chat-input-bg)] border-[var(--border)] ">
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
            <div className="relative  px-2" ref={menuRef}>
              <button
                className="p-1 border-2 border-gray-500 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-400 cursor-pointer"
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <Icon icon="mdi:plus" className="h-5 w-5" />
              </button>

              {menuOpen && (
                <InputToolsMenu
                  onFolderSelected={(folderName) =>
                    setUploadedFolder(folderName)
                  }
                  onFilesSelected={readFilesAsBase64}
                />
              )}
            </div>

            <div className="flex items-center gap-2 px-1">
              {/* file upload */}
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
              {/* Send button yoki Voice button */}
              {message.trim() || uploadedFile.length > 0 ? (
                <button
                  onClick={handleSend}
                  className="py-2 px-2 bg-button-bg text-white rounded-full cursor-pointer"
                >
                  <Icon
                    icon="solar:arrow-up-outline"
                    className="h-5 w-5 text-white"
                  />
                </button>
              ) : (
                <button
                  onClick={handleOpenVoiceChat}
                  className="py-2 px-2 bg-button-bg text-white rounded-full cursor-pointer"
                >
                  <Icon
                    icon="solar:soundwave-outline"
                    className="h-5 w-5 text-white"
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Voice Chat Modal */}
      <VoiceChat
        isOpen={voiceChatOpen}
        onClose={handleCloseVoiceChat}
        // onSendVoiceMessage={handleSendVoiceMessage}
      />
    </>
  );
}
