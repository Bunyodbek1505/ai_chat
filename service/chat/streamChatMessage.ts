import { API_URL } from "../../global";
import Cookies from "js-cookie";

export type ChatMessagePayload = {
  model: string;
  messages: {
    role: "system" | "user" | "assistant";
    content: any;
  }[];
  stream?: boolean;
  chatId?: string;
};

export async function streamChatMessage(
  payload: ChatMessagePayload,
  onChunk: (text: string) => void,
  onStart?: (taskId: string) => void,
  onComplete?: (meta: any) => void
): Promise<{ newChatId?: string }> {
  const token = Cookies.get("token");
  const chatId = payload.chatId;

  try {
    const startTime = performance.now();
    const userInput = payload.messages[payload.messages.length - 1];

    const body: any = {
      model: payload.model,
      content: userInput.content,
    };

    // MUHIM: Faqat mavjud chat bo'lsa chatId qo'shamiz
    if (chatId) {
      body.chatId = chatId;
      console.log("Mavjud chatga xabar yuborilmoqda, chatId:", chatId);
    } else {
      console.log("Yangi chat yaratilmoqda, chatId yuborilmayapti");
    }

    const response = await fetch(`${API_URL}/message/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok || !response.body) {
      throw new Error(`Server xatosi: ${response.statusText}`);
    }

    // Header'dan yangi chat ID'sini olamiz (faqat yangi chat yaratilganda mavjud bo'ladi)
    const newChatId = response.headers.get("x-chat-id") || undefined;

    if (newChatId) {
      console.log("Server'dan yangi chat ID olindu:", newChatId);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.substring(6);
          if (data === "[DONE]") {
          } else {
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content;
              if (content) {
                onChunk(content);
              }
              if (parsed.usage && onComplete) {
                const endTime = performance.now();
                onComplete({
                  ...parsed.usage,
                  responseTime: (endTime - startTime) / 1000,
                });
              }
            } catch (e) {
              console.error("JSON parse xatoligi:", data);
            }
          }
        }
      }
    }

    return { newChatId };
  } catch (error) {
    console.error("Stream xatoligi:", error);
    onChunk(
      `\n\n**Xatolik yuz berdi:** ${
        error instanceof Error ? error.message : "Noma'lum xato"
      }`
    );
    throw error;
  }
}
