"use client";

import { Check } from "lucide-react";

interface MessageBubbleProps {
  body: string;
  isOwn: boolean;
  createdAt: number;
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessageBubble({ body, isOwn, createdAt }: MessageBubbleProps) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} group`}>
      <div
        className={`flex items-end gap-2 max-w-[75%] ${isOwn ? "flex-row-reverse" : "flex-row"}`}
      >
        {/* Bubble */}
        <div
          className={`relative px-4 py-2.5 rounded-2xl ${
            isOwn ? "rounded-br-sm" : "rounded-bl-sm"
          }`}
          style={{
            background: isOwn ? "var(--bg-bubble-sent)" : "var(--bg-bubble-recv)",
            color: isOwn ? "var(--text-bubble-sent)" : "var(--text-bubble-recv)",
          }}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{body}</p>
          <div
            className={`flex items-center gap-1 mt-1 ${
              isOwn ? "justify-end" : "justify-start"
            }`}
          >
            <span className="text-[10px] opacity-60">{formatTime(createdAt)}</span>
            {isOwn && <Check className="w-3 h-3 text-green-400" />}
          </div>
        </div>
      </div>
    </div>
  );
}
