"use client";
import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";

interface NewChatButtonProps {
  onNewChat: () => void;
  isExpanded?: boolean;
}

export function NewChatButton({
  onNewChat,
  isExpanded = true,
}: NewChatButtonProps) {
  if (isExpanded) {
    return (
      <div className="px-4 py-3">
        <motion.button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer text-sm font-medium border border-border transition-all duration-200 bg-startNewChatBg text-startNewChatColor hover:bg-opacity-80 active:scale-95"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.span
            initial={{ rotate: 0 }}
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Icon
              icon="material-symbols:edit-square-outline-rounded"
              className="text-lg"
            />
          </motion.span>
          <span className="text-sm font-medium">New chat</span>
        </motion.button>
      </div>
    );
  }

  return (
    <motion.button
      className="p-2 rounded-lg hover:bg-border transition-colors"
      onClick={onNewChat}
      title="Yangi chat boshlash"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon
        icon="solar:pen-new-square-outline"
        className="h-5 w-5 text-gray-400"
      />
    </motion.button>
  );
}
