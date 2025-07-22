"use client";

import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import ChatArea from "@/components/chatArea";
import { useChatStore } from "@/store/chatStore";
import { motion, easeInOut } from "framer-motion";

export default function ChatPage() {
  const { isSidebarOpen } = useChatStore();

  const contentVariants = {
    expanded: {
      marginLeft: 0,
      transition: {
        duration: 0.3,
        ease: easeInOut,
      },
    },
    collapsed: {
      marginLeft: 0,
      transition: {
        duration: 0.3,
        ease: easeInOut,
      },
    },
  };

  const overlayVariants = {
    visible: {
      opacity: 1,
      pointerEvents: "auto",
      transition: {
        duration: 3,
      },
    },
    hidden: {
      opacity: 0,
      pointerEvents: "none",
      transition: {
        duration: 3,
      },
    },
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar - fixed and overlays main content */}
      {isSidebarOpen && (
        <div className="sm:hidden fixed inset-0 z-40 flex">
          <Sidebar />
          {/* Black background */}
          <div
            className="flex-1 bg-black bg-opacity-50"
            onClick={() => useChatStore.getState().setIsSidebarOpen(false)}
          />
        </div>
      )}

      {/* Mobile Overlay */}
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        variants={overlayVariants}
        animate={isSidebarOpen ? "visible" : "hidden"}
        initial="hidden"
        onClick={() => useChatStore.getState().setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <motion.div
        className="flex-1 h-screen relative transition-colors duration-300 overflow-hidden"
        variants={contentVariants}
        animate={isSidebarOpen ? "expanded" : "collapsed"}
        initial={false}
      >
        {/* Header */}
        <motion.div
          className="absolute top-0 z-10 w-full"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Header />
        </motion.div>

        {/* Chat Area */}
        <motion.div
          className="h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <ChatArea />
        </motion.div>
      </motion.div>
    </div>
  );
}
