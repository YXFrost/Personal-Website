"use client";
import Image from "next/image";
import { useEffect, useId, useRef } from "react";

// Native modal dialogs provide focus containment, Escape, and inert background.
export default function ImageLightbox({ info, alt, children }) {
  const dialog = useRef(null);
  const trigger = useRef(null);
  const previousOverflow = useRef("");
  const opened = useRef(false);
  useEffect(() => () => {
    if (opened.current) document.body.style.overflow = previousOverflow.current;
  }, []);
  const titleId = useId();
  function open() {
    previousOverflow.current = document.body.style.overflow;
    dialog.current.showModal();
    opened.current = true;
    document.body.style.overflow = "hidden";
  }
  function restore() {
    opened.current = false;
    document.body.style.overflow = previousOverflow.current;
    trigger.current?.focus();
  }
  return <>
    <button type="button" ref={trigger} className="image-trigger" onClick={open}
      aria-label={`Enlarge image${alt ? `: ${alt}` : ""}`} aria-haspopup="dialog">
      {children}
      <span className="image-enlarge" aria-hidden="true">Enlarge ↗</span>
    </button>
    <dialog ref={dialog} className="image-dialog" aria-labelledby={titleId} onClose={restore}
      onClick={(event) => { if (event.target === event.currentTarget) dialog.current.close(); }}>
      <div className="image-dialog-content">
        <h2 id={titleId} className="sr-only">Enlarged image</h2>
        <button type="button" className="button secondary image-close" onClick={() => dialog.current.close()}>Close ×</button>
        <Image {...info} alt={alt} sizes="95vw" />
        {alt && <p>{alt}</p>}
      </div>
    </dialog>
  </>;
}
