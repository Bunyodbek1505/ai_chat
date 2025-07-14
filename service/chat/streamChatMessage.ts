import { API_KEY, API_URL } from "../../global";

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
  const url = API_URL + "/v1-openai/chat/completions";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  };

  const startTime = performance.now();

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: payload.model,
      messages: payload.messages,
      stream: true,
    }),
  });

  if (!res.ok || !res.body) {
    throw new Error("API yoki stream bilan muammo");
  }

  const reader = res.body.getReader();
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
        // ✅ Meta ma’lumotlar yakuniy blokda bo‘ladi
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
