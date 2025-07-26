"use client";

import { Icon } from "@iconify/react/dist/iconify.js";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ThemeSwitch = () => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // SSR oldini olish

  return (
    <div className="flex items-center bg-gray-700 px-1 py-0.5 rounded-full text-white text-sm w-fit">
      <button
        className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors duration-200 ${
          theme === "light" ? "bg-blue-500 text-white" : "text-gray-300"
        }`}
        onClick={() => setTheme("light")}
      >
        <Icon icon="mdi:weather-sunny" className="text-base" />
      </button>
      <button
        className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors duration-200 ${
          theme === "dark" ? "bg-blue-500 text-white" : "text-gray-300"
        }`}
        onClick={() => setTheme("dark")}
      >
        <Icon icon="mdi:weather-night" className="text-base" />
      </button>
    </div>
  );
};
