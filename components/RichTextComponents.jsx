import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import CodeBlock from "./CodeBlock";
import ZoomableImage from "./ZoomableImage";

// We use a NAMED export here
export const RichTextComponents = {
  types: {
    // How to render images uploaded in the rich text editor
    image: ({ value }) => {
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
      return <CodeBlock value={value} />;
    },
  },
};