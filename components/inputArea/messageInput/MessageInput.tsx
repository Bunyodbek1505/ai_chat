import React, { useRef, useEffect } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onEnter: () => void;
}

export default function MessageInput({ value, onChange, onEnter }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value === "" && contentRef.current) {
      contentRef.current.innerText = "";
    }
  }, [value]);

  const handleInput = () => {
    if (contentRef.current) {
      onChange(contentRef.current.innerText);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  return (
    // ai input prompt
    <div className=" max-h-[300px] w-full overflow-y-auto overflow-x-hidden custom-scrollbar">
      <div
        ref={contentRef}
        contentEditable
        className="outline-none text-sm px-2 py-1 text-[var(--foreground)] break-words whitespace-pre-wrap"
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
