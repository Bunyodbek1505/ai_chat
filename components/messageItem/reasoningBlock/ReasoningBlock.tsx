import React from "react";
import { Icon } from "@iconify/react";
import { ClipLoader } from "react-spinners";

export const ReasoningBlock = ({
  show,
  setShow,
  reasoning,
  isFinished,
}: {
  show: boolean;
  setShow: (v: boolean) => void;
  reasoning: string;
  isFinished: boolean;
}) => (
  <div className="mb-4 mt-2">
    <button
      onClick={() => setShow(!show)}
      className="flex items-center gap-1 text-xs text-blue-400 hover:underline transition"
    >
      <Icon
        icon={show ? "mdi:chevron-down" : "mdi:chevron-right"}
        className="w-4 h-4"
      />
      {show ? "Hide AI Thinking" : "Show AI Thinking"}
      {!isFinished && <ClipLoader color="#ccc" size={12} />}
    </button>

    {show && (
      <div className="mt-2 bg-[#2B2B2F] text-sm text-gray-300 p-3 rounded-md border border-gray-600 whitespace-pre-wrap leading-relaxed">
        {reasoning}
      </div>
    )}
  </div>
);
