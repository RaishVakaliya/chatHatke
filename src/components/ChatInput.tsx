"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Smile, Paperclip, Send } from "lucide-react";

interface ChatInputProps {
  chatId: Id<"chats">;
}

export default function ChatInput({ chatId }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);
  const sendMessage = useMutation(api.chats.sendMessage);

  const handleSend = async () => {
    const trimmed = value.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setValue("");
    try {
      await sendMessage({ chatId, body: trimmed });
    } catch (err) {
      console.error("Failed to send message:", err);
      setValue(trimmed);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
          disabled={sending}
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
            onClick={handleSend}
            disabled={!value.trim() || sending}
            className="ml-1 w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-40"
            style={{
              background: value.trim() ? "var(--text-primary)" : "var(--active-chat)",
              color: value.trim() ? "var(--bg-primary)" : "var(--text-secondary)",
            }}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
