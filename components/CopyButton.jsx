"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
const noop = () => () => {};
export default function CopyButton({ text }) {
  const supported = useSyncExternalStore(
    noop,
    () => Boolean(navigator.clipboard?.writeText),
    () => false,
  );
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  if (!supported) return null;
  return (
    <button
      type="button"
      className="copy-button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => setCopied(false), 1600);
        } catch {
          setCopied(false);
        }
      }}
    >
      <span aria-live="polite">{copied ? "Copied ✓" : "Copy"}</span>
    </button>
  );
}
