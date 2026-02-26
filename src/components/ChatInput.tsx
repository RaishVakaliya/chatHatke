"use client";

import { useState } from "react";
import { Smile, Paperclip, Mic } from "lucide-react";

export default function ChatInput() {
  const [value, setValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setValue("");
    }
  };

  return (
    <div
      className="px-4 py-3 shrink-0"
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--bg-sidebar)",
      }}
    >
      <div
        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl"
        style={{ background: "var(--input-bg)" }}
      >
        <input
          type="text"
          placeholder="Enter message..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-sm text-(--text-primary) placeholder:text-(--text-secondary) outline-none"
        />
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 flex items-center justify-center text-(--text-secondary) hover:text-(--text-primary) transition-colors">
            <Smile className="w-4 h-4" />
          </button>
          <button className="w-7 h-7 flex items-center justify-center text-(--text-secondary) hover:text-(--text-primary) transition-colors">
            <Paperclip className="w-4 h-4" />
          </button>
          <button
            className="ml-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: value ? "var(--text-primary)" : "var(--active-chat)",
              color: value ? "var(--bg-primary)" : "var(--text-secondary)",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
