"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Smile, Paperclip, Send } from "lucide-react";
import { useTyping } from "@/hooks/useTyping";
import { EMOJIS } from "@/constant/emoji";

interface ChatInputProps {
  chatId: Id<"chats">;
}

export default function ChatInput({ chatId }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const emojiRef = useRef<HTMLDivElement>(null);
  const sendMessage = useMutation(api.chats.sendMessage);
  const { startTyping, stopTyping } = useTyping(chatId);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmojis(false);
      }
    };
    if (showEmojis) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showEmojis]);

  const insertEmoji = (emoji: string) => {
    setValue((prev) => prev + emoji);
    startTyping();
  };

  const handleSend = async () => {
    const trimmed = value.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setValue("");
    setShowEmojis(false);
    stopTyping();
    try {
      await sendMessage({ chatId, body: trimmed });
    } catch (err) {
      console.error("Failed to send message:", err);
      setValue(trimmed);
    } finally {
      setSending(false);
    }
  };

  const handleEnterPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="px-4 py-3 shrink-0 relative"
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--bg-sidebar)",
      }}
    >
      {showEmojis && (
        <div
          ref={emojiRef}
          className="absolute bottom-full mb-2 left-4 right-4 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
          style={{
            background: "var(--bg-sidebar)",
            border: "1px solid var(--border)",
          }}
        >
          <div className="grid grid-cols-10 gap-0.5 max-h-48 overflow-y-auto custom-scroll">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => insertEmoji(emoji)}
                className="text-xl w-9 h-9 flex items-center justify-center rounded-lg hover:scale-125 transition-transform hover:bg-(--active-chat)"
                title={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl"
        style={{ background: "var(--input-bg)" }}
      >
        <input
          type="text"
          placeholder="Enter message..."
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (e.target.value) {
              startTyping();
            } else {
              stopTyping();
            }
          }}
          onKeyDown={handleEnterPress}
          disabled={sending}
          className="flex-1 bg-transparent text-sm text-(--text-primary) placeholder:text-(--text-secondary) outline-none"
        />
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowEmojis((v) => !v)}
            className={`w-7 h-7 flex items-center justify-center transition-colors ${
              showEmojis
                ? "text-(--text-primary)"
                : "text-(--text-secondary) hover:text-(--text-primary)"
            }`}
          >
            <Smile className="w-4 h-4" />
          </button>
          <button
            onClick={handleSend}
            disabled={!value.trim() || sending}
            className="ml-1 w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-40"
            style={{
              background: value.trim()
                ? "var(--text-primary)"
                : "var(--active-chat)",
              color: value.trim()
                ? "var(--bg-primary)"
                : "var(--text-secondary)",
            }}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
