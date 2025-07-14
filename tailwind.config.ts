/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";
import scrollbar from "tailwind-scrollbar";

const config = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // colors: {
      //   // ranglar dark va light uchun
      //   background: {
      //     DEFAULT: "#212124", // dark
      //     light: "oklch(1 0 0)", // light
      //   },
      //   foreground: {
      //     DEFAULT: "#ededed", // dark
      //     light: "#232327", // light
      //   },
      //   sidebarBg: {
      //     // DEFAULT: "#1d1d20",
      //     // light: "#000",
      //   },
      //   chatArea: {
      //     DEFAULT: "#212124",
      //     light: "#f4f6f8",
      //   },
      //   inputArea: {
      //     DEFAULT: "#2b2b30",
      //     light: "#ffffff",
      //   },
      //   startNewChatBg: {
      //     DEFAULT: "#38383b",
      //     light: "#fff",
      //   },
      //   startNewChatColor: {
      //     DEFAULT: "#fff",
      //     light: "#232327",
      //   },
      //   border: {
      //     DEFAULT: "#232327",
      //     light: "#d9d9de",
      //   },
      //   themeBgModalBtn: {
      //     DEFAULT: "#2b2b30",
      //     light: "#e9ebf0",
      //   },
      //   themeIconBg: {
      //     DEFAULT: "#303033",
      //     light: "#e9ebf0",
      //   },
      //   sendChatBg: {
      //     DEFAULT: "#1c64f2",
      //     light: "#1c64f2",
      //   },
      //   aiAnswerBg: {
      //     DEFAULT: "#2b2b2f",
      //     light: "#f4f6f8",
      //   },
      // },
    },
  },
  plugins: [typography, scrollbar],
};

export default config;
