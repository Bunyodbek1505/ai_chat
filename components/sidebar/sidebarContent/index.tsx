"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NewChatButton } from "../newChatButton";
import ChatHistory from "@/components/chatList";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";


interface SidebarContentProps {
  isSidebarOpen: boolean;
  onNewChat: () => void;
}

export function SidebarContent({
  isSidebarOpen,
  onNewChat,
}: SidebarContentProps) {
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
          // Expanded Content
          <motion.div
            key="expanded"
            variants={contentVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="h-full flex flex-col"
          >
            {/* New Chat Button */}
            <NewChatButton onNewChat={onNewChat} isExpanded={true} />

            {/* Chat History */}
            <motion.div className="flex-1 overflow-y-auto">
              <ChatHistory />
            </motion.div>

            {/* Footer */}
            <motion.div className="px-4 py-3 border-t border-border">
              <div className="flex items-center justify-between">
                <ThemeSwitch />
                <motion.div
                  className="text-xs text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Powered By{" "}
                  <span className="font-bold text-foreground">FizmaSoft</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          // Collapsed Content
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

            {/* Theme Switch */}
            <motion.div className="flex flex-col items-center">
              <ThemeSwitch />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
