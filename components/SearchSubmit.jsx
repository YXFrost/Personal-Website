"use client";
import { useEffect } from "react";
import { useFormStatus } from "react-dom";
// Marks the results region busy while a search navigation is pending.
export default function SearchSubmit({ results }) {
  const { pending } = useFormStatus();
  useEffect(() => {
    document.getElementById(results)?.setAttribute("aria-busy", String(pending));
  }, [pending, results]);
  return (
    <button className="button secondary" type="submit">
      Search
    </button>
  );
}
