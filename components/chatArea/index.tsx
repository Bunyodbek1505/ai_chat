"use client";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useChatStore } from "@/store/chatStore";
import { streamChatMessage } from "@/service/chat/streamChatMessage";
import { useModelStore } from "@/store/modelStore";
import StopResponding from "../stopResponding";
import InputArea from "../inputArea";
import MessageItem from "../messageItem";
import { v4 as uuidv4 } from "uuid";

export interface Message {
  id: string;
  question?: string;
  answer?: string;
  reasoning?: string;
  isLoading?: boolean;
  meta?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    responseTime: number;
  };
}

export default function ChatArea() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const { activeChatId, messages, setMessages, isStreaming, setStreaming } =
    useChatStore();
  const model = useModelStore((s) => s.model);
  const { setIsSidebarOpen } = useChatStore();

  const content = useModelStore((state) => state.content);
  // console.log("Store'dan olingan content:", content);

  useEffect(() => {
    const isMobile = window.innerWidth < 1023;
    setIsSidebarOpen(!isMobile);
  }, []);

  const handleSend = (
    payload:
      | string
      | {
          content: {
            type: "text" | "image_url";
            text?: string;
            image_url?: { url: string };
          }[];
        }
  ) => {
    const id = uuidv4();
    const newMessage = { id, question: "", answer: "", isLoading: true };

    let userMessage: any;
    if (typeof payload === "string") {
      newMessage.question = payload;

      userMessage = { role: "user", content: payload };
    } else if (typeof payload === "object" && Array.isArray(payload.content)) {
      newMessage.question = payload.content
        .map((c) =>
          c.type === "text" ? c.text : c.type === "image_url" ? "[Rasm]" : ""
        )
        .join(" ");
      userMessage = { role: "user", content: payload.content };
    }

    setMessages((prev) => [...prev, newMessage]);
    setStreaming(true);

    let fullAnswer = "";
    let reasoningBuffer = "";
    let reasoningDone = false;

    const contextMessages = messages.flatMap((msg) => {
      const result: { role: "user" | "assistant"; content: any }[] = [];
      if (msg.question) result.push({ role: "user", content: msg.question });
      if (msg.answer) {
        const cleanAnswer = msg.answer
          .replace(/<think>[\s\S]*?<\/think>/gi, "")
          .trim();
        result.push({ role: "assistant", content: cleanAnswer });
      }

      return result;
    });

    // Use dynamic system content from the store, with fallback
    const systemContent = content || "You are a helpful assistant.";

    const fullMessages: {
      role: "system" | "user" | "assistant";
      content: any;
    }[] = [
      { role: "system", content: systemContent },
      ...contextMessages,
      userMessage,
    ];

    streamChatMessage(
      {
        model: `${model}`,
        messages: fullMessages,
        stream: true,
      },
      (chunk) => {
        reasoningBuffer += chunk;

        if (!reasoningDone) {
          const match = reasoningBuffer.match(/<think>([\s\S]*?)<\/think>/i);
          if (match) {
            const reasoning = match[1].trim();
            reasoningDone = true;

            setMessages((prev) =>
              prev.map((msg) => (msg.id === id ? { ...msg, reasoning } : msg))
            );
          }
        }

        fullAnswer += reasoningBuffer;
        reasoningBuffer = "";

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
    )
      .then(() => setStreaming(false))
      .catch(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === id
              ? { ...msg, answer: "Xatolik yuz berdi!", isLoading: false }
              : msg
          )
        );
        setStreaming(false);
      });
  };

  useLayoutEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  return (
    <main className="flex flex-col h-full bg-chatArea ">
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
            <StopResponding
              onStop={async () => {
                setStreaming(false);
              }}
            />
          </div>
        )}
        <div className="w-full px-0 pb-6 flex justify-center ">
          <div className="w-full max-w-4xl md: p-2">
            <InputArea onSend={handleSend} />
          </div>
        </div>
      </div>
    </main>
  );
}
