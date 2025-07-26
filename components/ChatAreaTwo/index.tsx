"use client";

import { useLayoutEffect, useRef } from "react";
import { useChatStore } from "@/store/chatStore";
import { streamChatMessage } from "@/service/chat/streamChatMessage";
import { useModelStore } from "@/store/modelStore";
import StopResponding from "../stopResponding";
import InputArea from "../inputArea";
import MessageItem from "../messageItem";
import { v4 as uuidv4 } from "uuid";
import { useShallow } from "zustand/react/shallow";

// ChatAreaTwo endi to'liq funksional chat oynasi
export default function ChatAreaTwo() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // useShallow optimallashtirish uchun ishlatiladi, faqat kerakli o'zgarishlarda qayta render qiladi
  const { chat2State, setChat2Messages, setChat2Streaming } = useChatStore(
    useShallow((state) => ({
      chat2State: state.chat2State,
      setChat2Messages: state.setChat2Messages,
      setChat2Streaming: state.setChat2Streaming,
    }))
  );

  const { messages, isStreaming } = chat2State;

  const model = useModelStore((s) => s.model);
  const content = useModelStore((state) => state.content);

  const handleSend = async (payload: any) => {
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

    setChat2Messages((prev) => [...prev, newMessage]);
    setChat2Streaming(true);

    let fullAnswer = "";

    // Chat 2 ning o'zining kontekstini yaratamiz
    const contextMessages = messages.flatMap((msg) => {
      const result: { role: "user" | "assistant"; content: any }[] = [];
      if (msg.question) result.push({ role: "user", content: msg.question });
      if (msg.answer)
        result.push({
          role: "assistant",
          content: msg.answer,
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
      // ChatAreaTwo o'zining chat sessiyasini boshqaradi, chatId yoki ro'yxatni yangilamaydi
      await streamChatMessage(
        { model: `${model}`, messages: fullMessages, stream: true },
        (chunk) => {
          fullAnswer += chunk;
          setChat2Messages((prev) =>
            prev.map((msg) =>
              msg.id === id
                ? { ...msg, answer: fullAnswer, isLoading: false }
                : msg
            )
          );
        },
        undefined,
        (meta) => {
          setChat2Messages((prev) =>
            prev.map((msg) => (msg.id === id ? { ...msg, meta } : msg))
          );
        }
      );
    } catch (error) {
      console.error("Chat 2 xabar yuborishda xatolik:", error);
      setChat2Messages((prev) =>
        prev.map((msg) =>
          msg.id === id
            ? {
                ...msg,
                answer: `Xatolik: ${
                  error instanceof Error ? error.message : "Noma'lum xato"
                }`,
                isLoading: false,
              }
            : msg
        )
      );
    } finally {
      setChat2Streaming(false);
    }
  };

  useLayoutEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  return (
    <main className="flex flex-col h-full bg-chatArea overflow-x-hidden">
      <h1 className="absolute top-1/2 left-1/2">Chat 2</h1>
    </main>
  );
}
