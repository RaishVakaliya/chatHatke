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
  const time = formatTime(createdAt);

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative px-3.5 py-2 rounded-2xl max-w-[75%] ${
          isOwn ? "rounded-br-sm" : "rounded-bl-sm"
        }`}
        style={{
          background: isOwn ? "var(--bg-bubble-sent)" : "var(--bg-bubble-recv)",
          color: isOwn ? "var(--text-bubble-sent)" : "var(--text-bubble-recv)",
        }}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {body}
          {/* Spacer to reserve room for the timestamp on the last line */}
          <span
            className="inline-block select-none pointer-events-none"
            style={{ width: isOwn ? "72px" : "44px" }}
            aria-hidden
          />
        </p>

        {/* Floating timestamp — bottom-right inside the bubble */}
        <span
          className="absolute bottom-1.5 right-2.5 flex items-center gap-0.5 opacity-60"
          style={{ fontSize: "10px", lineHeight: 1 }}
        >
          {time}
          {isOwn && <Check className="w-3 h-3 text-green-400 opacity-100" style={{ opacity: 1 }} />}
        </span>
      </div>
    </div>
  );
}
