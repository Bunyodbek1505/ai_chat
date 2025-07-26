"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

interface ChatMenuProps {
  isOpen: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
  isSubmitting: boolean;
  position: { top: number; right: number };
}

const ChatMenu: React.FC<ChatMenuProps> = React.memo(
  ({ isOpen, onEdit, onDelete, onClose, isSubmitting, position }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-[998]" onClick={onClose}>
        <div
          className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 menu-container min-w-[140px] z-[999]"
          style={{
            top: `${position.top}px`,
            right: `${position.right}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onEdit}
            className="w-full flex items-center gap-3 text-sm px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
            disabled={isSubmitting}
          >
            <Icon
              icon="solar:pen-bold"
              className="text-base text-gray-600 dark:text-gray-400"
            />
            <span className="font-medium text-gray-800 dark:text-gray-200">
              Edit
            </span>
          </button>

          <button
            onClick={onDelete}
            className="w-full flex items-center gap-3 text-sm px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
            disabled={isSubmitting}
          >
            <Icon
              icon="solar:trash-bin-trash-bold"
              className="text-base text-red-600 dark:text-red-400"
            />
            <span className="font-medium text-red-600 dark:text-red-400">
              Delete
            </span>
          </button>
        </div>
      </div>
    );
  }
);

ChatMenu.displayName = "ChatMenu";

export default ChatMenu;
