import { getChatList } from "@/service/chat";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";

interface Chat {
  id: string;
  title: string;
  user_id: string;
  last_message_at: string;
}

const ChatHistory = () => {
  const [chatList, setChatList] = useState<Chat[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const getChatListHistory = async () => {
    const res = await getChatList();
    setChatList(res.data);
    return res;
  };

  useEffect(() => {
    getChatListHistory();
  }, []);

  return (
    <div className="flex-1 px-3 pt-0 h-full overflow-y-auto custom-scrollbar">
      {chatList.length === 0 ? (
        <p className="text-sm text-gray-400">No chat history available.</p>
      ) : (
        <ul className="space-y-2">
          {chatList.map((chat) => (
            <li
              key={chat.id}
              onClick={() => setActiveId(chat.id)}
              className={`flex items-center justify-between bg-popover rounded-lg py-1 px-2 shadow cursor-pointer transition-all
              ${activeId === chat.id ? "bg-accent/20" : "hover:bg-accent/10"}
            `}
            >
              <div className="font-medium text-foreground">{chat.title}</div>
              <Icon
                icon="solar:menu-dots-bold"
                className="text-lg text-muted-foreground"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatHistory;
