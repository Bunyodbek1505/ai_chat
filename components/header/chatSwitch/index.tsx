
import { useChatStore } from "@/store/chatStore";
import clsx from "clsx";

interface ChatSwitcherProps {
  activeChat: "chat1" | "chat2";
  setActiveChat: (chat: "chat1" | "chat2") => void;
}

const ChatSwitcher = ({ activeChat, setActiveChat }: ChatSwitcherProps) => {
  const setActiveAdminView = useChatStore((s) => s.setActiveAdminView);
  const setIsSidebarOpen = useChatStore((s) => s.setIsSidebarOpen);

  const handleChatSwitch = (chat: "chat1" | "chat2") => {
    setActiveChat(chat); 
    setActiveAdminView(chat); 
    setIsSidebarOpen(chat === "chat1"); 
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
        {(["chat1", "chat2"] as const).map((chat) => (
          <button
            key={chat}
            onClick={() => handleChatSwitch(chat)}
            className={clsx(
              "relative z-10 px-6 py-2 rounded-xl font-medium transition-all",
              {
                "bg-white text-black dark:bg-gray-700 dark:text-white":
                  activeChat === chat,
                "bg-transparent text-gray-600 dark:text-gray-300":
                  activeChat !== chat,
              }
            )}
          >
            {chat === "chat1" ? "Chat 1" : "Chat 2"}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatSwitcher;
