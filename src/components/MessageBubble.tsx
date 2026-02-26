"use client";

import { Message } from "@/types";
import { MoreHorizontal, Check } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isOwn = message.isOwn;

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} group`}>
      <div
        className={`flex items-end gap-2 max-w-[75%] ${isOwn ? "flex-row-reverse" : "flex-row"}`}
      >
        {/*bubble*/}
        <div
          className={`relative px-4 py-2.5 rounded-2xl ${
            isOwn ? "rounded-br-sm" : "rounded-bl-sm"
          }`}
          style={{
            background: isOwn
              ? "var(--bg-bubble-sent)"
              : "var(--bg-bubble-recv)",
            color: isOwn
              ? "var(--text-bubble-sent)"
              : "var(--text-bubble-recv)",
          }}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
          <div
            className={`flex items-center gap-1 mt-1 ${isOwn ? "justify-end" : "justify-start"}`}
          >
            <span className="text-[10px] opacity-60">{message.timestamp}</span>
            {isOwn && <Check className="w-3 h-3 text-green-400" />}
          </div>
        </div>

        {/*options button*/}
        <button className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-full flex items-center justify-center text-(--text-secondary) hover:bg-(--active-chat) shrink-0 self-center">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
