"use client";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import ChatArea from "@/components/chatArea";

export default function ChatPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="w-full h-screen relative transition-colors duration-300">
        <div className="absolute top-0 z-10 w-full ">
          <Header />
        </div>
        <div className="h-full">
          <ChatArea />
        </div>
      </div>
    </div>
  );
}
