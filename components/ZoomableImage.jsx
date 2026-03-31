"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ZoomableImage({ src, alt, className, priority }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMagnified, setIsMagnified] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Prevent background scrolling and allow ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);

      // Trigger entrance animation
      setTimeout(() => setIsAnimatingIn(true), 10);
    } else {
      document.body.style.overflow = "auto";
      setIsAnimatingIn(false);
      setIsClosing(false);
    }

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Handle closing the lightbox and resetting zoom
  const handleClose = (e) => {
    if (e) e.stopPropagation();

    // Start exit animation
    setIsClosing(true);

    // Wait for animation to finish before unmounting
    setTimeout(() => {
      setIsOpen(false);
      setIsMagnified(false);
      setIsClosing(false);
    }, 300);
  };

  // Toggle magnification
  const toggleMagnify = (e) => {
    e.stopPropagation();
    setIsMagnified(!isMagnified);
  };

  return (
    <>
      {/* 1. Standard Image on the page (Thumbnail) */}
      <div
        className="relative w-full h-full cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className={`${className} cursor-pointer transition-transform duration-300 hover:scale-[1.02]`}
          priority={priority}
        />
      </div>

      {/* 2. Lightbox / Enlarged Overlay */}
      {isOpen && (
        <div
          className={`fixed inset-0 z-100 flex items-center justify-center 
          bg-black/90 backdrop-blur-sm p-4 transition-opacity duration-300
          ${isAnimatingIn && !isClosing ? "opacity-100" : "opacity-0"}`}
          onClick={handleClose}
        >
          {/* 
            SCALING CONTAINER
            - Opens with scale-90 → scale-100
            - Closes with scale-100 → scale-90
            - X button follows scaling because it's inside this container
          */}
          <div
            className={`relative w-[50vw] h-[50vh] flex items-center justify-center 
            transition-all duration-300 ease-out will-change-transform
            ${
              isClosing
                ? "scale-90 opacity-0"
                : isAnimatingIn
                ? isMagnified
                  ? "scale-[2] opacity-100"
                  : "scale-100 opacity-100"
                : "scale-90 opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button ("X") */}
            <button
              className="absolute -top-8 -right-8 w-10 h-10 flex items-center justify-center 
              text-white/70 hover:text-amber text-3xl font-light z-110 transition-colors"
              onClick={handleClose}
              aria-label="Close image"
            >
              &times;
            </button>

            {/* Image Container (handles zoom interaction) */}
            <div
              className={`relative w-full h-full overflow-hidden rounded-sm transition-all duration-500 
              ${
                isMagnified
                  ? "shadow-2xl cursor-zoom-out"
                  : "shadow-lg cursor-zoom-in"
              }`}
              onClick={toggleMagnify}
              title={isMagnified ? "Click to unmagnify" : "Click to magnify"}
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}