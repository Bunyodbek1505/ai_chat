
"use client";

import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { useChatStore } from "@/store/chatStore";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarOpen, setIsSidebarOpen } = useChatStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsSidebarOpen]);

  const contentVariants = {
    expanded: { marginLeft: 0 },
    collapsed: { marginLeft: 0 },
  };

  const overlayVariants = {
    visible: {
      opacity: 1,
      pointerEvents: "auto",
      transition: { duration: 0.3 },
    },
    hidden: {
      opacity: 0,
      pointerEvents: "none",
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />

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

        {children}
      </motion.div>
    </div>
  );
}
