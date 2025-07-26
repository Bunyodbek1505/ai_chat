"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NewChatButton } from "../newChatButton";
import ChatHistory from "@/components/chatList";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useUserStore } from "@/store/userStore";
import { useLogout } from "@/hooks/useLogout";
import SettingsModal from "../settingsModal";
import SidebarProfile from "../sidebarProfile";

interface SidebarContentProps {
  isSidebarOpen: boolean;
  onNewChat: () => void;
}

export function SidebarContent({
  isSidebarOpen,
  onNewChat,
}: SidebarContentProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false); // ✅ ADD THIS

  const username = useUserStore((s) => s.user?.username);
  const router = useRouter();

  const handleNewChatClick = () => {
    onNewChat();
    router.push("/chat");
  };

  const contentVariants = {
    open: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.25,
        delay: 0.1,
      },
    },
    closed: {
      opacity: 0,
      x: -20,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div className="flex-1 overflow-hidden">
      <AnimatePresence mode="wait">
        {isSidebarOpen ? (
          <motion.div
            key="expanded"
            variants={contentVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="h-full flex flex-col"
          >
            {/* New Chat Button */}
            <NewChatButton onNewChat={handleNewChatClick} isExpanded={true} />

            {/* Chat History */}
            <motion.div className="flex-1 overflow-y-auto">
              <ChatHistory />
            </motion.div>

            {/* Expanded Footer */}
            <motion.div className="px-4 py-2 border-t border-border bg-chat-input-bg m-4 rounded-xl">
              <SidebarProfile onOpenSettings={() => setSettingsOpen(true)} />
            </motion.div>
          </motion.div>
        ) : (
          // Sidebar yopilgan holati
          <motion.div
            key="collapsed"
            variants={contentVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="h-full flex flex-col justify-between py-4"
          >
            {/* New Chat Button */}
            <motion.div className="flex flex-col items-center gap-3">
              <NewChatButton onNewChat={onNewChat} isExpanded={false} />
            </motion.div>

            {/* Collapsed Footer */}
            <motion.div className="flex flex-col items-center py-4 gap-3 relative">
              {/* Avatar */}
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-7 h-7 rounded-full bg-purple-700 flex items-center justify-center text-white text-sm font-semibold cursor-pointer"
              >
                {username?.slice(0, 1)}
              </button>

              {/* Profile Menu Dropdown */}
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="fixed left-18 bottom-[50px] z-10 w-[250px] px-4 py-3 bg-chat-input-bg rounded-xl border border-border shadow-lg"
                  >
                    <SidebarProfile
                      onOpenSettings={() => setSettingsOpen(true)}
                      onCloseMenu={() => setShowProfileMenu(false)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </motion.div>
  );
}
