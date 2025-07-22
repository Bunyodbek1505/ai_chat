import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyButton } from "../copyButton";

const customCodeStyle = {
  ...materialDark,
  'pre[class*="language-"]': {
    ...materialDark['pre[class*="language-"]'],
    padding: "1em",
    borderRadius: "0.7em",
  },
  code: {
    ...(materialDark.code || {}),
  },
};

export const MarkdownRenderer = ({ content }: { content: string }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      code({ inline, className, children, ...props }: any) {
        const match = /language-(\w+)/.exec(className || "");
        const code = Array.isArray(children)
          ? children.join("").trim()
          : String(children).trim();

        return !inline && match ? (
          <div className="relative my-4">
            <CopyButton code={code} />
            <SyntaxHighlighter
              style={customCodeStyle}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        ) : (
          <code className={className} {...props}>
            {children}
          </code>
        );
      },
      p: (props) => <p className="mb-2" {...props} />,
      ul: (props) => <ul className="list-disc pl-5" {...props} />,
      li: (props) => <li className="mb-1" {...props} />,
      strong: (props) => <strong className="font-medium" {...props} />,
      table: (props) => (
        <table
          className="table-auto border-collapse border border-gray-700 text-sm w-full my-4"
          {...props}
        />
      ),
      thead: (props) => (
        <thead className="bg-gray-800 text-gray-200" {...props} />
      ),
      tr: (props) => (
        <tr
          className="border-b border-gray-700  hover:bg-gray-900 transition hover:text-gray-200"
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
          className="px-4 py-2 border border-gray-700 text-table-text"
          {...props}
        />
      ),
    }}
  >
    {content}
  </ReactMarkdown>
);
