"use client";

import React, { useCallback, useRef, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import EditForm from "../editForm";
import ChatMenu from "../chatMenu";


interface Chat {
  id: string;
  title: string;
}

interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  isEditing: boolean;
  editValue: string;
  onEditValueChange: (value: string) => void;
  onChatClick: (chatId: string) => void;
  onMenuToggle: (e: React.MouseEvent, chatId: string) => void;
  onEditStart: (chat: Chat) => void;
  onEditSave: (chatId: string) => void;
  onEditCancel: () => void;
  onDeleteStart: (chatId: string) => void;
  isMenuOpen: boolean;
  isSubmitting: boolean;
}

const ChatItem: React.FC<ChatItemProps> = React.memo(
  ({
    chat,
    isActive,
    isEditing,
    editValue,
    onEditValueChange,
    onChatClick,
    onMenuToggle,
    onEditStart,
    onEditSave,
    onEditCancel,
    onDeleteStart,
    isMenuOpen,
    isSubmitting,
  }) => {
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

    const handleMenuToggle = useCallback(
      (e: React.MouseEvent) => {
        if (menuButtonRef.current) {
          const rect = menuButtonRef.current.getBoundingClientRect();
          setMenuPosition({
            top: rect.bottom + 5,
            right: window.innerWidth - rect.right,
          });
        }
        onMenuToggle(e, chat.id);
      },
      [onMenuToggle, chat.id]
    );

    const handleEditStart = useCallback(() => {
      onEditStart(chat);
    }, [onEditStart, chat]);

    const handleEditSave = useCallback(() => {
      onEditSave(chat.id);
    }, [onEditSave, chat.id]);

    const handleDeleteStart = useCallback(() => {
      onDeleteStart(chat.id);
    }, [onDeleteStart, chat.id]);

    return (
      <li
        onClick={() => onChatClick(chat.id)}
        className={`group relative flex items-center justify-between bg-popover rounded-lg p-2 transition-all duration-200
        ${
          isActive && !isEditing
            ? "bg-chat-input-bg"
            : "hover:bg-chat-input-bg"
        }
        ${isEditing ? "bg-chat-input-bg cursor-default" : "cursor-pointer"}
        ${isSubmitting ? "opacity-50 pointer-events-none" : ""}
      `}
      >
        <div className="flex items-center w-full gap-2">
          <div className="font-medium text-foreground truncate text-sm flex-1">
            {isEditing ? (
              <EditForm
                value={editValue}
                onChange={onEditValueChange}
                onSave={handleEditSave}
                onCancel={onEditCancel}
                isSubmitting={isSubmitting}
              />
            ) : (
              <span>{chat.title || "Nomsiz chat"}</span>
            )}
          </div>

          <div className="relative">
            <button
              ref={menuButtonRef}
              onClick={handleMenuToggle}
              className={`flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200
              ${
                isMenuOpen
                  ? "bg-gray-200 dark:bg-gray-700"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }
            `}
            >
              <Icon
                icon="solar:menu-dots-bold"
                className={`text-lg text-muted-foreground transition-opacity duration-200
                ${
                  isMenuOpen || isActive
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }
              `}
              />
            </button>

            <ChatMenu
              isOpen={isMenuOpen}
              onEdit={handleEditStart}
              onDelete={handleDeleteStart}
              onClose={() => onMenuToggle({} as React.MouseEvent, chat.id)}
              isSubmitting={isSubmitting}
              position={menuPosition}
            />
          </div>
        </div>
      </li>
    );
  }
);

ChatItem.displayName = "ChatItem";

export default ChatItem;
