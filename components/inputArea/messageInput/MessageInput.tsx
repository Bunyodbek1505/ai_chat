import React, { useRef, useEffect, useState } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onEnter: () => void;
}

export default function MessageInput({ value, onChange, onEnter }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    if (value === "" && contentRef.current) {
      contentRef.current.innerText = "";
      setIsEmpty(value.trim() === "");
    }
  }, [value]);

  const handleInput = () => {
    if (contentRef.current) {
      const text = contentRef.current.innerText;
      onChange(text);
      setIsEmpty(text.trim() === "");
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  return (
    <div className="relative max-h-[300px] w-full overflow-y-auto overflow-x-hidden custom-scrollbar">
      {isEmpty && (
        <div className="absolute top-0 left-0 h-full w-full flex items-center px-2 py-1 pointer-events-none select-none">
          <span className="text-sm text-gray-400">Prompt...</span>
        </div>
      )}
      <div
        ref={contentRef}
        contentEditable
        className="outline-none text-sm px-2 py-1 text-[var(--foreground)] break-words whitespace-pre-wrap direction-ltr"
        style={{ direction: "ltr" }}
        onInput={handleInput}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onEnter();
          }
        }}
        onPaste={handlePaste}
        suppressContentEditableWarning
      ></div>
    </div>
  );
}
