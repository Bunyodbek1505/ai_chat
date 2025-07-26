"use client";
import { useLayoutEffect, useRef } from "react";
import { useChatStore } from "@/store/chatStore";
import { streamChatMessage } from "@/service/chat/streamChatMessage";
import { useModelStore } from "@/store/modelStore";
import StopResponding from "../stopResponding";
import InputArea from "../inputArea";
import MessageItem from "../messageItem";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { getChatList } from "@/service/chat";

export interface Message {
  id: string;
  question?: string;
  answer?: string;
  reasoning?: string;
  isLoading?: boolean;
  meta?: any;
}

export default function ChatArea({ activeChatId }: { activeChatId?: string }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const {
    messages,
    setMessages,
    isStreaming,
    setStreaming,
    setChatList,
    setActiveChatId,
  } = useChatStore();
  const model = useModelStore((s) => s.model);
  const content = useModelStore((state) => state.content);

  const handleSend = async (payload: any) => {
    const isNewChat = !activeChatId;
    const id = uuidv4();

    const newMessage = { id, question: "", answer: "", isLoading: true };
    let userMessage: any;

    if (typeof payload === "string") {
      newMessage.question = payload;
      userMessage = { role: "user", content: payload };
    } else {
      newMessage.question = payload.content
        .map((c: any) => (c.type === "text" ? c.text : "[Rasm]"))
        .join(" ");
      userMessage = { role: "user", content: payload.content };
    }

    setMessages((prev) => [...prev, newMessage]);
    setStreaming(true);

    let fullAnswer = "";

    const contextMessages = messages.flatMap((msg) => {
      const result: { role: "user" | "assistant"; content: any }[] = [];
      if (msg.question) result.push({ role: "user", content: msg.question });
      if (msg.answer)
        result.push({
          role: "assistant",
          content: msg.answer.replace(/<think>[\s\S]*?<\/think>/gi, "").trim(),
        });
      return result;
    });

    const systemContent = content || "Siz yordamchi assistantsiz.";
    const fullMessages: any[] = [
      { role: "system", content: systemContent },
      ...contextMessages,
      userMessage,
    ];

    try {
      const { newChatId } = await streamChatMessage(
        {
          model: `${model}`,
          messages: fullMessages,
          stream: true,
          chatId: activeChatId,
        },
        (chunk) => {
          fullAnswer += chunk;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === id
                ? { ...msg, answer: fullAnswer, isLoading: false }
                : msg
            )
          );
        },
        undefined,
        (meta) => {
          setMessages((prev) =>
            prev.map((msg) => (msg.id === id ? { ...msg, meta } : msg))
          );
        }
      );

      // URL va State'ni yangilash
      if (isNewChat && newChatId) {
        // URL'ni yangilaymiz (replace bilan, history'da bo'sh sahifa qolmasin)
        router.replace(`/chat/${newChatId}`);

        // Store'dagi activeChatId ni yangilaymiz
        setActiveChatId(newChatId);

        // Chat ro'yxatini yangilaymiz
        try {
          const res = await getChatList();
          if (res?.data && Array.isArray(res.data)) {
            setChatList(res.data);
          }
        } catch (error) {
          console.error("Chat ro'yxatini yangilashda xatolik:", error);
        }
      } else if (activeChatId) {
        // Chat ro'yxatini yangilaymiz (title va last_message_at o'zgarishi mumkin)
        try {
          const res = await getChatList();
          if (res?.data && Array.isArray(res.data)) {
            setChatList(res.data);
          }
        } catch (error) {
          console.error("Chat ro'yxatini yangilashda xatolik:", error);
        }
      }
    } catch (error) {
      console.error("Xabar yuborishda xatolik:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id
            ? {
                ...msg,
                answer: `Xatolik yuz berdi: ${
                  error instanceof Error ? error.message : "Noma'lum xato"
                }`,
                isLoading: false,
              }
            : msg
        )
      );
    } finally {
      setStreaming(false);
    }
  };

  useLayoutEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  return (
    <main className="flex flex-col h-full bg-chatArea overflow-x-hidden">
      <div className="flex-1 overflow-y-auto p-0 flex flex-col items-center pt-6">
        <div className="w-full max-w-3xl flex flex-col gap-6 mt-8">
          {Array.isArray(messages) &&
            messages.map((msg) => (
              <MessageItem
                key={msg.id}
                question={msg.question}
                answer={msg.answer}
                isLoading={msg.isLoading}
                responseMeta={msg.meta}
              />
            ))}
          <div ref={scrollRef} />
        </div>
      </div>
      <div className="relative">
        {isStreaming && (
          <div className="absolute top-[-20] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <StopResponding onStop={() => setStreaming(false)} />
          </div>
        )}
        <div className="w-full px-0 pb-6 flex justify-center">
          <div className="w-full max-w-4xl md: p-2">
            <InputArea onSend={handleSend} />
          </div>
        </div>
      </div>
    </main>
  );
}
