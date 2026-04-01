import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import CodeBlock from "./CodeBlock";
import ZoomableImage from "./ZoomableImage";

// We use a NAMED export here
export const RichTextComponents = {
  types: {
    // How to render images uploaded in the rich text editor
    image: ({ value }) => {
      // Defensive check: skip rendering if the image asset is missing
      if (!value?.asset?._ref) return null;
      
      return (
        <div className="relative w-full aspect-video my-10 rounded-lg overflow-hidden border border-border bg-card">
          <ZoomableImage
            src={urlFor(value).url()}
            alt={value.alt || "Project inline image"}
            fill
            className="object-contain"
          />
        </div>
      );
    },
    
    // How to render the code blocks
    code: ({ value }) => {
      // Defensive check: skip if the code block is completely empty
      if (!value?.code) return null;
      return <CodeBlock value={value} />;
    },
  },

  // ✅ LISTS (UL / OL wrappers)
  list: {
    // Bullet list (Unordered)
    bullet: ({ children }) => (
      <ul className="list-disc list-outside ml-6 space-y-2 mb-6 text-text-secondary marker:text-amber">
        {children}
      </ul>
    ),
    // Number list (Ordered)
    number: ({ children }) => (
      <ol className="list-decimal list-outside ml-6 space-y-2 mb-6 text-text-secondary marker:text-amber">
        {children}
      </ol>
    ),
  },

  // ✅ LIST ITEMS (LI inside the UL/OL)
  listItem: {
    // Bullet list items
    bullet: ({ children }) => <li className="pl-2 leading-relaxed">{children}</li>,
    // Number list items
    number: ({ children }) => <li className="pl-2 leading-relaxed">{children}</li>,
  },

  // ✅ BLOCK ELEMENTS (Headings, Paragraphs, Blockquotes)
  block: {
    // # H1
    h1: ({ children }) => (
      <h1 className="text-4xl md:text-5xl font-display text-text-primary mt-12 mb-6">
        {children}
      </h1>
    ),
    // ## H2
    h2: ({ children }) => (
      <h2 className="text-3xl md:text-4xl font-display text-text-primary mt-10 mb-5 border-b border-border pb-2">
        {children}
      </h2>
    ),
    // ### H3
    h3: ({ children }) => (
      <h3 className="text-2xl md:text-3xl font-display text-text-primary mt-8 mb-4">
        {children}
      </h3>
    ),
    // #### H4
    h4: ({ children }) => (
      <h4 className="text-xl md:text-2xl text-text-primary mt-6 mb-3">
        {children}
      </h4>
    ),
    // ##### H5
    h5: ({ children }) => (
      <h5 className="text-lg md:text-xl text-text-primary mt-5 mb-2">
        {children}
      </h5>
    ),
    // ###### H6
    h6: ({ children }) => (
      <h6 className="text-base md:text-lg text-text-primary mt-4 mb-2 uppercase tracking-wider">
        {children}
      </h6>
    ),
    // Normal Paragraphs
    normal: ({ children }) => (
      <p className="text-text-secondary leading-relaxed mb-6">
        {children}
      </p>
    ),
    // > Blockquotes
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-amber pl-4 py-1 my-6 italic text-text-secondary bg-black/10 rounded-r">
        {children}
      </blockquote>
    ),
  },

  // ✅ MARKS (Inline formatting: bold, italic, links, etc.)
  marks: {
    // Links
    link: ({ children, value }) => {
      // Safely grab the URL, default to '#' if undefined
      const href = value?.href || "#";
      // Check if it's an external link (doesn't start with / or #)
      const isExternal = !href.startsWith("/") && !href.startsWith("#");
      
      return (
        <a 
          href={href} 
          rel={isExternal ? "noreferrer noopener" : undefined} 
          target={isExternal ? "_blank" : undefined}
          className="text-amber hover:text-amber/80 underline decoration-amber/50 underline-offset-4 transition-colors"
        >
          {children}
        </a>
      );
    },
    // Bold
    strong: ({ children }) => (
      <strong className="font-bold text-text-primary">{children}</strong>
    ),
    // Italic
    em: ({ children }) => (
      <em className="italic text-text-primary/90">{children}</em>
    ),
    // Underline
    underline: ({ children }) => (
      <span className="underline underline-offset-4 decoration-text-secondary/50">{children}</span>
    ),
    // Strikethrough (Sanity outputs this as "strike-through")
    "strike-through": ({ children }) => (
      <del className="line-through decoration-text-secondary/60 text-text-secondary/60">{children}</del>
    ),
    // Inline code (e.g. `const x = 1` inside a paragraph)
    code: ({ children }) => (
      <code className="bg-border/30 text-text-primary font-mono text-sm px-1.5 py-0.5 rounded border border-border">
        {children}
      </code>
    ),
  },
};