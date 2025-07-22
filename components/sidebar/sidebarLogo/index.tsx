"use client";
import React from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import fizmaSoftLogo1 from "@/public/logo1.svg";
import fizmaSoftLogo2 from "@/public/logo2.svg";

interface SidebarLogoProps {
  isSidebarOpen: boolean;
}

export function SidebarLogo({ isSidebarOpen }: SidebarLogoProps) {
  const { resolvedTheme } = useTheme();

  return (
    <motion.div
      className={`flex items-center ${
        isSidebarOpen ? "gap-2" : "justify-center"
      }`}
      layout
    >
      <Image
        src={resolvedTheme === "dark" ? fizmaSoftLogo1 : fizmaSoftLogo2}
        alt="logo"
        className="h-7 w-7"
      />
    </motion.div>
  );
}
