"use client";

import React, { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useModelStore } from "@/store/modelStore";
import { Icon } from "@iconify/react/dist/iconify.js";

interface Props {
  onFolderSelected: (folderName: string) => void;
  onFilesSelected: (files: FileList) => void;
}

const InputToolsMenu = ({ onFolderSelected, onFilesSelected }: Props) => {
  const thinkEnabled = useModelStore((s) => s.thinkEnabled);
  const setThinkEnabled = useModelStore((s) => s.setThinkEnabled);

  const folderInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFolderClick = () => {
    folderInputRef.current?.click();
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="absolute bottom-full mb-2 py-2 px-0.5 left-0 z-10 bg-sidebar rounded-md shadow-lg w-44 text-sm text-gray-800 dark:text-white">
      {/* Folder Upload */}
      <button
        onClick={handleFolderClick}
        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[var(--accent)] transition-all hover:text-white"
      >
        <Icon icon="mdi:folder-upload-outline" className="w-5 h-5" />
        <span>Upload Folder</span>
      </button>
      <input
        ref={folderInputRef}
        type="file"
        webkitdirectory="true"
        // ref={(ref) => {
        //   if (ref) ref.setAttribute("webkitdirectory", "");
        //   folderInputRef.current = ref;
        // }}
        multiple
        hidden
        onChange={(e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            const folderName =
              files[0].webkitRelativePath?.split("/")?.[0] || files[0].name;
            onFolderSelected(folderName);
          }
        }}
      />

      {/* File Upload */}
      <button
        onClick={handleFileClick}
        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[var(--accent)] transition-all hover:text-white"
      >
        <Icon icon="mdi:paperclip" className="w-5 h-5" />
        <span>Upload Files</span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        hidden
        onChange={(e) => e.target.files && onFilesSelected(e.target.files)}
      />
      {/* switch */}
      <div className="flex items-center justify-between px-4 py-2 hover:bg-gray-700 cursor-pointer hover:text-white">
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
  );
};

export default InputToolsMenu;
