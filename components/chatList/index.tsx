"use client";

import { deleteChatTitle, getChatList, updateChatTitle } from "@/service/chat";
import { useChatStore } from "@/store/chatStore";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ChatItem from "./chatItem";
import DeleteModal from "./deleteModal";

export interface Chat {
  id: string;
  title: string;
}

const ChatHistory = () => {
  const [loading, setLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editInputValue, setEditInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const { chatList, setChatList, activeChatId, setActiveChatId } =
    useChatStore();
  const router = useRouter();

  // Chat ro'yxatini yuklash
  const loadChatHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getChatList();
      setChatList(res?.data && Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Chat ro'yxatini yuklashda xatolik:", error);
      setChatList([]);
    } finally {
      setLoading(false);
    }
  }, [setChatList]);

  useEffect(() => {
    loadChatHistory();
  }, [loadChatHistory]);

  // Tashqi bosish orqali menuni yopish
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".menu-container") && !target.closest(".edit-form")) {
        setOpenMenuId(null);
        if (editingChatId) {
          setEditingChatId(null);
          setEditInputValue("");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editingChatId]);

  // Chat bosilganda
  const handleChatClick = useCallback(
    (chatId: string) => {
      if (editingChatId === chatId || isSubmitting) return;

      const isMobile = window.innerWidth < 640;
      if (isMobile) {
        useChatStore.getState().setIsSidebarOpen(false);
      }

      if (chatId !== activeChatId) {
        router.push(`/chat/${chatId}`);
      }
    },
    [editingChatId, isSubmitting, activeChatId, router]
  );

  // Menu toggle
  const handleMenuToggle = useCallback(
    (e: React.MouseEvent, chatId: string) => {
      e.stopPropagation();
      setOpenMenuId((prev) => (prev === chatId ? null : chatId));
    },
    []
  );

  // Tahrirlashni boshlash
  const handleEditStart = useCallback((chat: Chat) => {
    setEditingChatId(chat.id);
    setEditInputValue(chat.title);
    setOpenMenuId(null);
  }, []);

  // Tahrirlashni bekor qilish
  const handleEditCancel = useCallback(() => {
    setEditingChatId(null);
    setEditInputValue("");
  }, []);

  // Tahrirlashni saqlash
  const handleEditSave = async (chatId: string) => {
    if (!editInputValue.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await updateChatTitle(chatId, editInputValue.trim());
      setChatList(
        chatList.map((chat) =>
          chat.id === chatId ? { ...chat, title: editInputValue.trim() } : chat
        )
      );
      setEditingChatId(null);
    } catch (error) {
      console.error("Chatni tahrirlashda xatolik:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // O'chirishni boshlash
  const handleDeleteStart = useCallback((chatId: string) => {
    setPendingDeleteId(chatId);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  }, []);

  // O'chirishni tasdiqlash
  const handleDeleteConfirm = async (chatId: string) => {
    setIsSubmitting(true);
    try {
      await deleteChatTitle(chatId);
      setChatList(chatList.filter((chat) => chat.id !== chatId));
      if (activeChatId === chatId) {
        router.push("/chat");
        setActiveChatId(undefined);
      }
    } catch (error) {
      console.error("Chatni o‘chirishda xatolik:", error);
    } finally {
      setIsSubmitting(false);
      setShowDeleteModal(false);
      setPendingDeleteId(null);
    }
  };

  // O'chirishni bekor qilish
  const handleDeleteCancel = useCallback(() => {
    setShowDeleteModal(false);
    setPendingDeleteId(null);
  }, []);

  return (
    <div className="flex-1 px-3 pt-0 h-full overflow-y-auto custom-scrollbar relative">
      <h2 className="text-[#afafaf] text-sm px-2 py-3 font-medium">
        Chat History
      </h2>

      <ul className="space-y-1">
        {chatList.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isActive={activeChatId === chat.id}
            isEditing={editingChatId === chat.id}
            editValue={editInputValue}
            onEditValueChange={setEditInputValue}
            onChatClick={handleChatClick}
            onMenuToggle={handleMenuToggle}
            onEditStart={handleEditStart}
            onEditSave={handleEditSave}
            onEditCancel={handleEditCancel}
            onDeleteStart={handleDeleteStart}
            isMenuOpen={openMenuId === chat.id}
            isSubmitting={isSubmitting}
          />
        ))}
      </ul>

      <DeleteModal
        isOpen={showDeleteModal}
        onConfirm={() => {
          if (pendingDeleteId) {
            handleDeleteConfirm(pendingDeleteId);
          }
        }}
        onCancel={handleDeleteCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default React.memo(ChatHistory);
