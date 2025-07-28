"use client";

import ChatArea from "@/components/chatArea";
import ChatAreaTwo from "@/components/ChatAreaTwo"; 
import { useChatStore } from "@/store/chatStore";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getChatHistoryById } from "@/service/chat";
import { motion } from "framer-motion";
import { useUserStore } from "@/store/userStore";
import { Message } from "@/components/chatArea"; // Message type

const formatMessagesFromHistory = (chatHistory: any[]): Message[] => {
  const formatted: Message[] = [];
  if (!Array.isArray(chatHistory)) return formatted;

  for (let i = 0; i < chatHistory.length; i += 2) {
    const user = chatHistory[i];
    const assistant = chatHistory[i + 1];

    formatted.push({
      id: uuidv4(),
      question: user?.content || "",
      answer: assistant?.content || "",
      isLoading: false,
      meta: assistant
        ? {
            prompt_tokens: 0,
            completion_tokens: assistant.tokensUsed || 0,
            total_tokens: assistant.tokensUsed || 0,
            responseTime: 0,
          }
        : undefined,
    });
  }

  if (chatHistory.length % 2 === 1) {
    formatted.push({
      id: uuidv4(),
      question: chatHistory[chatHistory.length - 1].content,
      answer: "",
      isLoading: false,
      meta: undefined,
    });
  }
  return formatted;
};

export default function ChatPage() {
  const params = useParams();
  const chatId = params.chatId ? (params.chatId as string[])[0] : undefined;

  const {
    setActiveChatId,
    setMessages,
    clearMessages,
    activeAdminView,
    clearChat2,
  } = useChatStore();

  const role = useUserStore((s) => s.user?.role);
  const setIsSidebarOpen = useChatStore((s) => s.setIsSidebarOpen);
  const [, setIsChatLoading] = useState(true);

  useEffect(() => {
    const initializeChat = async () => {
      setIsChatLoading(true);
      if (chatId) {
        setActiveChatId(chatId);
        try {
          const response = await getChatHistoryById(chatId);
          const formatted = formatMessagesFromHistory(response?.data || []);
          setMessages(formatted);
        } catch (error) {
          console.error(
            `'${chatId}' IDli chat tarixini yuklashda xatolik:`,
            error
          );
          clearMessages();
        }
      } else {
        setActiveChatId(undefined);
        clearMessages();
      }
      setIsChatLoading(false);
    };

    // Faqat chat1 bo'lsa tarixni yuklaymiz
    if (role !== "admin" || activeAdminView === "chat1") {
      initializeChat();
      setIsSidebarOpen(true);
    }

    // chat2 rejimida tozalab qo'yamiz
    if (activeAdminView === "chat2") {
      clearChat2();
      setIsSidebarOpen(false); 
    } 
  }, [chatId, setActiveChatId, setMessages, clearMessages, activeAdminView]);

  return (
    <motion.div
      key={chatId || "new-chat-page"}
      className="h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {/* Admin bo'lsa va chat2 tanlangan bo'lsa ChatAreaTwo */}
      {role === "admin" && activeAdminView === "chat2" ? (
        <ChatAreaTwo />
      ) : (
        <ChatArea activeChatId={chatId} />
      )}
    </motion.div>
  );
}
