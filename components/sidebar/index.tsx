"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useChatStore } from "@/store/chatStore";
import { SidebarLogo } from "./sidebarLogo";
import { SidebarToggleButton } from "./sidebarToggleButton";
import { SidebarContent } from "./sidebarContent";

export default function Sidebar() {
  const { isSidebarOpen, setIsSidebarOpen, startNewChat } = useChatStore();
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkWidth = () => setIsMobile(window.innerWidth < 640);
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  if (!isMounted) {
    return (
      <aside className="hidden md:flex flex-col bg-sidebar shadow-2xl h-full text-foreground relative overflow-hidden w-[72px]">
        {/* Loading state */}
      </aside>
    );
  }

  // if (!isSidebarOpen) return null;

  // Animation variants
  const sidebarVariants = {
    open: {
      width: 280,
      transition: { duration: 0.3 },
    },
    closed: {
      width: 72,
      transition: { duration: 0.3 },
    },
  };

  const mobileSidebarVariants = {
    open: {
      x: 0,
      transition: { duration: 0.3 },
    },
    closed: {
      x: "-100%",
      transition: { duration: 0.3 },
    },
  };

  const sidebarVariant = isMobile ? mobileSidebarVariants : sidebarVariants;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className="flex flex-col bg-sidebar shadow-2xl h-full text-foreground relative overflow-hidden sm:relative w-[280px] sm:w-auto z-50 sm:z-auto"
        variants={sidebarVariant}
        animate={isSidebarOpen ? "open" : "closed"}
        initial={false}
      >
        {/* Header */}
        <motion.div
          className={`flex ${
            isSidebarOpen
              ? "items-center justify-between h-[56px] px-4"
              : "flex-col items-center gap-2 py-4 h-[120px]"
          } border-b border-border`}
          layout
        >
          <SidebarLogo isSidebarOpen={isSidebarOpen} />
          <SidebarToggleButton
            isSidebarOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </motion.div>

        {/* Main Content */}
        <SidebarContent
          isSidebarOpen={isSidebarOpen}
          onNewChat={startNewChat}
        />
      </motion.aside>
    </>
  );
}
