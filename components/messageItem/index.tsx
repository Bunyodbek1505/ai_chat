import Image from "next/image";
import React, { useState } from "react";
import avatarImage from "@/public/avatar.png";
import { extractThinkContent } from "@/utilits/extractThink";
import { ReasoningBlock } from "./reasoningBlock/ReasoningBlock";
import { MarkdownRenderer } from "./markdownRenderer/MarkdownRenderer";

export default function MessageItem({
  question,
  answer,
  isLoading,
  responseMeta,
}: {
  question?: string;
  answer?: string;
  isLoading?: boolean;
  responseMeta?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    responseTime: number;
  };
}) {
  const { reasoning, cleanedAnswer, isReasoningFinished } = extractThinkContent(
    answer || ""
  );
  const [showReasoning, setShowReasoning] = useState(!reasoning);

  return (
    <div className="flex flex-col gap-2">
      {/* Question */}
      <div className="flex justify-end">
        <div className="group flex gap-3 rounded-xl px-2 py-2 shadow-sm text-[var(--foreground)] font-medium text-base">
          <div className="bg-chat-input-bg min-w-13 text-white text-center px-4 py-2 rounded-tl-[18px] rounded-bl-[18px] rounded-br-[15px] rounded-tr-sm break-words">
            {question}
          </div>

        </div>
      </div>

      {/* Answer */}
      <div className="flex justify-start overflow-hidden">
        <div className="relative group prose rounded-xl px-5 pt-0 shadow-sm text-[var(--foreground)] max-w-[100%]">
          {isLoading ? (
            <span className="italic text-gray-400">...</span>
          ) : (
            <>
              {reasoning && (
                <ReasoningBlock
                  show={showReasoning}
                  setShow={setShowReasoning}
                  reasoning={reasoning}
                  isFinished={isReasoningFinished}
                />
              )}
              {cleanedAnswer && <MarkdownRenderer content={cleanedAnswer} />}
            </>
          )}

          {responseMeta && (
            <div className="absolute top-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex bg-[#1F1F1F] text-xs text-gray-300 px-3 py-2 shadow-lg w-max">
                <ul className="flex gap-2">
                  <li>Prompt: {responseMeta.prompt_tokens}</li>
                  <li>Completion: {responseMeta.completion_tokens}</li>
                  <li>Used: {responseMeta.total_tokens}</li>
                  <li>Time: {responseMeta.responseTime.toFixed(2)}s</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
