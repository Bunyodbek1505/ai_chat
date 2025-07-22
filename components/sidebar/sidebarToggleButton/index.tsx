"use client";
import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";

interface SidebarToggleButtonProps {
  isSidebarOpen: boolean;
  onToggle: () => void;
}

export function SidebarToggleButton({
  isSidebarOpen,
  onToggle,
}: SidebarToggleButtonProps) {
  const iconButtonVariants = {
    hover: {
      scale: 1.1,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  };

  return (
    <motion.button
      className={`p-1 rounded hover:bg-border ${isSidebarOpen ? "" : "mt-2"}`}
      onClick={onToggle}
      title={isSidebarOpen ? "Sidebar yopish" : "Sidebar ochish"}
      variants={iconButtonVariants}
      whileHover="hover"
      whileTap="tap"
    >
      <Icon
        icon={
          isSidebarOpen
            ? "lucide:panel-left"
            : "solar:sidebar-minimalistic-linear"
        }
        className="h-5 w-5 text-gray-400"
      />
    </motion.button>
  );
}
