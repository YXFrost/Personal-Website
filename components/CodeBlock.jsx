// Render highlighting on the server; no syntax-highlighter JavaScript is shipped to readers.
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
export default function CodeBlock({ value }) {
  if (!value?.code) return null;
  return <figure className="code-figure">
    {(value.filename || value.language) && <figcaption>{value.filename || value.language}</figcaption>}
    <SyntaxHighlighter language={value.language || "text"} style={vscDarkPlus}
      tabIndex={0} aria-label={`${value.language || "Plain text"} code sample`}
      customStyle={{ margin: 0, background: "#181815", padding: "1.25rem", fontSize: "0.875rem" }}
      codeTagProps={{ style: { fontFamily: "var(--mono)" } }}>
      {value.code}
    </SyntaxHighlighter>
  </figure>;
}
