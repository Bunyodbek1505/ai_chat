import { create } from "zustand";

import { Message } from "@/components/chatArea";

interface Chat {
  id: string;
  name: string;
}

interface ChatStoreState {
  chatList: Chat[];
  activeChatId?: string;
  messages: Message[];
  isSidebarOpen: boolean;
  isStreaming: boolean;
  currentTaskId: string | null;
  pinnedChats: { [id: string]: boolean };
  addNewChat: () => void;

  // Actions
  setIsSidebarOpen: (open: boolean) => void;
  setMessages: (updater: ((prev: Message[]) => Message[]) | Message[]) => void;
  setStreaming: (v: boolean) => void;
  pinChat: (chatId: string) => void;
  unpinChat: (chatId: string) => void;
}
const isMobileTablet =
  typeof window !== "undefined" ? window.innerWidth < 1023 : false;

export const useChatStore = create<ChatStoreState>((set, get) => ({
  chatList: [],
  activeChatId: undefined,
  messages: [],
  isSidebarOpen: !isMobileTablet,
  isStreaming: false,
  currentTaskId: null,
  pinnedChats: {},

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

  addNewChat: () => {
    const newId = Date.now().toString();
    set((state) => ({
      chatList: [{ id: newId, name: "New Chat" }, ...state.chatList],
      activeChatId: newId,
      messages: [],
    }));
  },
}));
