import { create } from "zustand";
import { Message } from "@/components/chatArea";

interface Chat {
  id: string;
  title: string;
  user_id: string;
  last_message_at: string;
}

// new
interface ChatTwoState {
  messages: Message[];
  isStreaming: boolean;
}

interface ChatStoreState {
  chatList: Chat[];
  activeChatId?: string;
  setActiveChatId: (id?: string) => void;
  messages: Message[];
  isSidebarOpen: boolean;
  isStreaming: boolean;
  currentTaskId: string | null;
  pinnedChats: { [id: string]: boolean };

  setChatList: (chats: Chat[]) => void;
  clearMessages: () => void;

  startNewChat: () => void;

  // Actions
  setIsSidebarOpen: (open: boolean) => void;
  setMessages: (updater: ((prev: Message[]) => Message[]) | Message[]) => void;
  setStreaming: (v: boolean) => void;
  pinChat: (chatId: string) => void;
  unpinChat: (chatId: string) => void;

  // Chat list'ni yangilash uchun
  updateChatList: (updatedChat: Chat) => void;

  // Ro'yxatga yangi chat qo'shish (faqat birinchi xabar yuborilgandan so'ng)
  addChatToList: (newChat: Chat) => void;

  // new
  activeAdminView: "chat1" | "chat2";
  setActiveAdminView: (mode: "chat1" | "chat2") => void;

  // Chat 2 ning o'z holatini saqlash uchun
  chat2State: ChatTwoState;

  // Chat 2 ni boshqarish uchun yangi, maxsus amallar
  setChat2Messages: (
    updater: ((prev: Message[]) => Message[]) | Message[]
  ) => void;
  setChat2Streaming: (v: boolean) => void;
  clearChat2: () => void;
}

export const useChatStore = create<ChatStoreState>((set) => ({
  chatList: [],
  activeChatId: undefined,
  messages: [],
  isSidebarOpen: false,
  isStreaming: false,
  currentTaskId: null,
  pinnedChats: {},

  setActiveChatId: (id) => {
    set({ activeChatId: id });
  },

  // Chat ro'yxatini o'rnatish
  setChatList: (chats) => set({ chatList: chats }),

  // Xabarlarni tozalash
  clearMessages: () => set({ messages: [] }),

  // Yangi chat boshlash uchun. Bu funksiya state'ni tozalaydi.
  // Komponent esa URL'ni o'zgartiradi.
  startNewChat: () => {
    set({ activeChatId: undefined, messages: [] });
  },

  // Yangi chat muvaffaqiyatli yaratilgandan so'ng uni ro'yxatga qo'shadi
  addChatToList: (newChat) => {
    set((state) => ({
      // Duplikatlarni oldini olish
      chatList: state.chatList.some((chat) => chat.id === newChat.id)
        ? state.chatList
        : [newChat, ...state.chatList],
    }));
  },

  setIsSidebarOpen(open) {
    set({ isSidebarOpen: open });
  },

  setMessages: (updater) => {
    if (typeof updater === "function") {
      set((state) => ({
        messages: (updater as (prev: Message[]) => Message[])(state.messages),
      }));
    } else {
      set({ messages: updater });
    }
  },

  setStreaming(v) {
    set({ isStreaming: v });
  },

  pinChat(chatId) {
    set((s) => ({
      pinnedChats: { ...s.pinnedChats, [chatId]: true },
    }));
  },

  unpinChat(chatId) {
    set((s) => {
      const copy = { ...s.pinnedChats };
      delete copy[chatId];
      return { pinnedChats: copy };
    });
  },

  // Chat list'ni yangilash (yangi xabar kelganda title va last_message_at'ni yangilash uchun)
  updateChatList: (updatedChat) => {
    set((state) => ({
      chatList: state.chatList.map((chat) =>
        chat.id === updatedChat.id ? { ...chat, ...updatedChat } : chat
      ),
    }));
  },
  
  // new
   activeAdminView: 'chat1',
  chat2State: {
    messages: [],
    isStreaming: false,
  },

  // Yangi amallarning implementatsiyasi
  setActiveAdminView: (mode) => set({ activeAdminView: mode }),
  
  setChat2Messages: (updater) => {
    set((state) => {
      const currentMessages = state.chat2State.messages;
      const newMessages = typeof updater === 'function' ? updater(currentMessages) : updater;
      return {
        chat2State: { ...state.chat2State, messages: newMessages }
      };
    });
  },

  setChat2Streaming: (v) => {
    set((state) => ({
      chat2State: { ...state.chat2State, isStreaming: v }
    }));
  },

  clearChat2: () => {
    set({
      chat2State: { messages: [], isStreaming: false }
    });
  },
}));
