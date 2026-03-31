"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

export default function CodeBlock({ value }) {
  if (!value || !value.code) return null;

  return (
    <div className="my-8 rounded-lg overflow-hidden border border-border bg-[#1e1e1e] shadow-lg">
      {/* Tab bar for the filename */}
      {value.filename && (
        <div className="px-4 py-2 bg-[#2d2d2d] text-text-secondary font-mono text-xs border-b border-text-muted">
          {value.filename}
        </div>
      )}
      
      <SyntaxHighlighter
        language={value.language || "text"}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: "1.5rem",
          background: "transparent",
          fontSize: "0.875rem",
          fontFamily: "var(--font-mono), monospace",
        }}
      >
        {value.code}
      </SyntaxHighlighter>
    </div>
  );
}