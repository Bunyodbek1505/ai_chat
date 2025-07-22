import { useChatStore } from "@/store/chatStore";
import { AI_API_URL, API_KEY, API_URL } from "../../global";
import { serviceApi } from "../serviceApi";
import { useUserStore } from "@/store/userStore";

export type ChatMessagePayload = {
  model: string;
  messages: {
    role: "system" | "user" | "assistant";
    content: string;
  }[];
  stream?: boolean;
};

export async function streamChatMessage(
  payload: ChatMessagePayload,
  onChunk: (text: string) => void,
  onStart?: (taskId: string) => void,
  onComplete?: (meta: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    responseTime: number;
  }) => void
): Promise<void> {
  const streamUrl = AI_API_URL + "/v1-openai/chat/completions";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  };

  
  const startTime = performance.now();

  const streamRequest = await fetch(streamUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: payload.model,
      messages: payload.messages,
      stream: true,
    }),
  });

  const userInput = payload.messages[payload.messages.length - 1];
  const chatId = useChatStore.getState().activeChatId;

  const localRequest = serviceApi("POST", "/message/send", {
    model: payload.model,
    // role: role,
    content: userInput.content,
    chatId,
  }).catch((err) => {
    console.warn("Mahalliy API xatolik:", err);
  });

  const res = await Promise.all([streamRequest, localRequest]);
  const streamRes = res[0];

  if (!streamRes.ok || !streamRes.body) {
    throw new Error("Stream API bilan muammo");
  }

  const reader = streamRes.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    buffer += chunk;

    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (let line of lines) {
      line = line.trim();
      if (!line.startsWith("data:")) continue;

      const jsonStr = line.slice(5).trim();
      if (jsonStr === "[DONE]") continue;

      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) {
          onChunk(content);
        }
        // Meta ma’lumotlar yakuniy blokda bo‘ladi
        const usage = parsed.usage;
        if (usage && onComplete) {
          const endTime = performance.now();
          const responseTime = (endTime - startTime) / 1000;

          onComplete({
            prompt_tokens: usage.prompt_tokens,
            completion_tokens: usage.completion_tokens,
            total_tokens: usage.total_tokens,
            responseTime,
          });
        }
      } catch (err) {
        console.warn("JSON parse xatoligi:", err);
      }
    }
  }
}
