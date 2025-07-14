"use client";
import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import ChatHistory from "../chatList";
import { useChatStore } from "@/store/chatStore";
import fizmaSoftLogo1 from "@/public/logo1.svg";
import fizmaSoftLogo2 from "@/public/logo2.svg";
import Image from "next/image";
import { ThemeSwitch } from "../ui/ThemeSwitch";
import { useTheme } from "next-themes";

export default function Sidebar() {
  const { isSidebarOpen, setIsSidebarOpen, addNewChat } = useChatStore();

  const { theme, resolvedTheme } = useTheme();

  // Kichik sidebar
  if (!isSidebarOpen) {
    return (
      <aside className="hidden sm:flex flex-col justify-between h-full w-[72px] border-r border-border text-foreground transition-all duration-300 relative">
        <div className="flex flex-col items-center pt-3 gap-3">
          <div className="flex flex-col items-center gap-1">
            <Image
              src={resolvedTheme === "dark" ? fizmaSoftLogo1 : fizmaSoftLogo2}
              alt="logo"
              className="h-7 w-7"
            />
          </div>
          <button
            className="mt-2 p-1 rounded hover:bg-border"
            onClick={() => setIsSidebarOpen(true)}
            title="Sidebar ochish"
          >
            <Icon
              icon={"solar:sidebar-minimalistic-linear"}
              className="h-5 w-5 text-gray-400"
            />
          </button>
          <button className="mt-2 p-1 rounded hover:bg-border">
            <Icon
              icon={"solar:pen-new-square-outline"}
              className="h-5 w-5 text-gray-400"
            />
          </button>
        </div>
        <div className="flex flex-col items-center pb-4">
          {/* ThemeSwitch ni joylashtiramiz */}
          <ThemeSwitch />
        </div>
      </aside>
    );
  }

  // Katta sidebar
  return (
    <div
      className="fixed md:static inset-0 z-40 md:hidden"
      style={{ display: isSidebarOpen ? "block" : "none" }}
    >
      <aside className=" flex flex-col h-full w-[260px] bg-sidebar  border-r border-border text-foreground transition-all duration-300 relative ">
        <div className="flex items-center justify-between h-[56px] px-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Image
              src={resolvedTheme === "dark" ? fizmaSoftLogo1 : fizmaSoftLogo2}
              alt="logo"
              width={40}
              className="h-7 w-7"
            />
          </div>
          <button
            className="p-1 rounded hover:bg-border"
            onClick={() => setIsSidebarOpen(false)}
            title="Sidebar yopish"
          >
            <Icon icon="lucide:panel-left" className="h-5 w-5 text-gray-400" />
          </button>
        </div>
        <div className="px-4 py-3">
          <button
            onClick={() => {
              addNewChat();
            }}
            className="w-full flex items-center justify-center gap-1 px-2 py-2 rounded-xl cursor-pointer text-sm font-medium border border-border transition bg-startNewChatBg text-startNewChatColor"
          >
            <span>
              <Icon
                icon="material-symbols:edit-square-outline-rounded"
                className="text-sm"
              />
            </span>
            <span className="text-sm">Start New chat</span>
          </button>
        </div>
        {/* chat list  */}
        <ChatHistory />

        {/* Footer */}
        <div className="relative flex flex-col items-center pb-4">
          <div className="w-full flex justify-between px-3 items-center">
            <div>
              {/* ThemeSwitch ni joylashtiramiz */}
              <ThemeSwitch />
            </div>
            <div className="mt-2 text-xs text-gray-400">
              Powered By{" "}
              <span className="font-bold text-foreground">FizmaSoft</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
