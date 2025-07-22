import React, { useState } from "react";

export const CopyButton = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copy failed", error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 text-xs px-2 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition z-1 cursor-pointer"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
};
