"use client";

import { useEffect } from "react";

export default function PointerEventsCleanup() {
  useEffect(() => {
    const cleanup = () => {
      try {
        document.body.style.pointerEvents = "auto";
        document.documentElement.style.pointerEvents = "auto";
        // Remove any react-remove-scroll interactivity lock classes
        document.body.className = document.body.className
          .split(" ")
          .filter((c) => !c.startsWith("block-interactivity-"))
          .join(" ");
        // Re-enable pointer events on elements that might have been left disabled
        document.querySelectorAll('[style*="pointer-events: none"]').forEach((el) => {
          (el as HTMLElement).style.pointerEvents = "auto";
        });
      } catch {
        // no-op
      }
    };

    window.addEventListener("focus", cleanup, true);
    window.addEventListener("click", cleanup, true);
    return () => {
      window.removeEventListener("focus", cleanup, true);
      window.removeEventListener("click", cleanup, true);
    };
  }, []);

  return null;
}


