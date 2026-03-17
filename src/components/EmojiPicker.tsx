"use client";

import { useEffect, useRef } from "react";
import { Picker } from "emoji-mart";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  theme?: string;
}

export default function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!ref.current || isInitialized.current) return;

    const isDark = document.documentElement.classList.contains("dark");

    ref.current.innerHTML = "";

    const picker = new Picker({
      data: async () => {
        const response = await fetch(
          "https://cdn.jsdelivr.net/npm/@emoji-mart/data",
        );
        return response.json();
      },
      onEmojiSelect: (emoji: any) => {
        onEmojiSelect(emoji.native);
      },
      parent: ref.current,
      theme: isDark ? "dark" : "light",
      previewPosition: "none",
      skinTonePosition: "none",
      navPosition: "top",
      perLine: 8,
      maxFrequentRows: 1,
      width: "100%",
    });

    isInitialized.current = true;

    return () => {
      if (ref.current) {
        ref.current.innerHTML = "";
        isInitialized.current = false;
      }
    };
  }, [onEmojiSelect]);

  return (
    <div
      ref={ref}
      className="w-full h-full min-h-[350px] custom-emoji-picker"
    />
  );
}
