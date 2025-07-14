/**
 * AI javobidan <think>...</think> blokni ajratib oladi
 * @param answer AI javobi
 * @returns { reasoning: string | null, cleanedAnswer: string }
 */

export function extractThinkContent(text: string) {
  const match = text.match(/<think>([\s\S]*?)<\/think>/i);

  if (match) {
    return {
      reasoning: match[1].trim(),
      cleanedAnswer: text.replace(match[0], "").trim(),
      isReasoningFinished: true,
    };
  }

  const openTag = text.match(/<think>([\s\S]*)$/i);
  if (openTag) {
    return {
      reasoning: openTag[1].trim(),
      cleanedAnswer: "",
      isReasoningFinished: false,
    };
  }

  return {
    reasoning: "",
    cleanedAnswer: text.trim(),
    isReasoningFinished: true,
  };
}
