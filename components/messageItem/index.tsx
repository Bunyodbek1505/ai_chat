import Image from "next/image";
import React, { useState } from "react";
import avatarImage from "@/public/avatar.png";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ClipLoader } from "react-spinners";
import { extractThinkContent } from "@/utilits/extractThink";

const customCodeStyle = {
  ...materialDark,
  'pre[class*="language-"]': {
    ...materialDark['pre[class*="language-"]'],
    padding: "1em",
    borderRadius: "0.5em",
  },
  code: {
    ...(materialDark.code || {}),
  },
};

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
  const [copied, setCopied] = useState(false);

  const { reasoning, cleanedAnswer, isReasoningFinished } = extractThinkContent(
    answer || ""
  );
  const [showReasoning, setShowReasoning] = useState(!!reasoning);

  const handleCopy = async () => {
    try {
      if (!question) return;
      await navigator.clipboard.writeText(question);
      setCopied(true);
      setTimeout(() => setCopied(false), 20000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Question (user) */}
      <div className="flex justify-end">
        <div className="group flex gap-3 rounded-xl px-2 py-3 shadow-sm  text-[var(--foreground)]  mr-0 font-medium text-base">
          <div className="relative">
            <div className="bg-[#A5BDDB] p-2 rounded-xl cursor-pointer w-full break-words">
              {question}
            </div>
          </div>
          <div className="relative flex-1">{/* <-- joylashadi */}</div>
          <div>
            <Image
              src={avatarImage}
              alt="avatar"
              className="w-10 h-10 bg-[#A5BDDB] p-0 rounded-full"
            />
          </div>
        </div>
      </div>
      {/* Answer (AI) */}
      <div className="flex justify-start">
        <div className="relative group prose rounded-xl px-5 pt-0 shadow-sm  text-[var(--foreground)] max-w-[100%] ml-2 border border-[var(--border)] ">
          {isLoading ? (
            <span className="italic text-gray-400">...</span>
          ) : (
            answer && (
              <>
                {/* Reasoning Accordion (agar mavjud bo‘lsa) */}
                {reasoning && (
                  <div className="mb-4 mt-2">
                    <button
                      onClick={() => setShowReasoning(!showReasoning)}
                      className="flex items-center gap-1 text-xs text-blue-400 hover:underline transition-colors duration-200"
                    >
                      <Icon
                        icon={
                          showReasoning
                            ? "mdi:chevron-down"
                            : "mdi:chevron-right"
                        }
                        className="w-4 h-4"
                      />
                      {showReasoning ? "Hide AI Thinking" : "Show AI Thinking"}
                      {!isReasoningFinished && (
                        <ClipLoader color="#ccc" size={12} />
                      )}
                    </button>

                    {showReasoning && (
                      <div className="mt-2 bg-[#2B2B2F] text-sm text-gray-300 p-3 rounded-md border border-gray-600 whitespace-pre-wrap leading-relaxed">
                        {reasoning}
                      </div>
                    )}
                  </div>
                )}

                {cleanedAnswer && (
                  <ReactMarkdown
                    components={{
                      code({ inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={customCodeStyle}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                      p: (props) => (
                        <p className="mb-2 font-['SansSerf']" {...props} />
                      ),
                      ul: (props) => (
                        <ul
                          className="list-disc pl-5 font-['SansSerf']"
                          {...props}
                        />
                      ),
                      li: (props) => <li className="mb-1" {...props} />,
                      strong: (props) => (
                        <strong
                          className="font-medium font-['SansSerf']"
                          {...props}
                        />
                      ),

                      // ✅ ADD TABLE STYLING:
                      table: (props) => (
                        <table
                          className="table-auto border-collapse border border-gray-700 text-sm w-full my-4"
                          {...props}
                        />
                      ),
                      thead: (props) => (
                        <thead
                          className="bg-gray-800 text-gray-200"
                          {...props}
                        />
                      ),
                      tbody: (props) => <tbody {...props} />,
                      tr: (props) => (
                        <tr
                          className="border-b border-gray-700 hover:bg-gray-900 transition"
                          {...props}
                        />
                      ),
                      th: (props) => (
                        <th
                          className="px-4 py-2 text-left font-semibold border border-gray-700 bg-gray-700 text-white"
                          {...props}
                        />
                      ),
                      td: (props) => (
                        <td
                          className="px-4 py-2 border border-gray-700 text-gray-200"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {cleanedAnswer}
                  </ReactMarkdown>
                )}
              </>
            )
          )}

          {responseMeta && (
            <div className="absolute top-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex bg-[#1F1F1F] text-xs text-gray-300 px-3 py-2 shadow-lg space-y-1 w-max">
                <ul className="flex gap-2">
                  <li>
                    <span>Prompt: </span>
                    <span>{responseMeta.prompt_tokens} token</span>
                  </li>
                  <li>
                    <span>Completion: </span>
                    <span>{responseMeta.completion_tokens} token</span>
                  </li>
                  <li>
                    <span>Used: </span>
                    <span>{responseMeta.total_tokens} token</span>
                  </li>
                  <li>
                    <span>Time: </span>
                    <span>{responseMeta.responseTime.toFixed(2)}s</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
