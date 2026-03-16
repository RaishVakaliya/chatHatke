"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface TypingIndicatorProps {
  chatId: Id<"chats">;
}

export default function TypingIndicator({ chatId }: TypingIndicatorProps) {
  const typers = useQuery(api.typing.getTypers, { chatId });

  if (!typers || typers.length === 0) return null;

  return (
    <div className="flex justify-start py-1 animate-in fade-in slide-in-from-bottom-1 duration-200">
      <div
        className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-sm"
        style={{ background: "var(--bg-bubble-recv)" }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block w-2 h-2 rounded-full"
            style={{
              background: "var(--text-bubble-recv)",
              opacity: 0.5,
              animation: "typingBounce 1.2s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
      <span
        className="text-[11px] mb-1 shrink-0 ml-2 mt-4"
        style={{ color: "var(--text-secondary)" }}
      >
        {`${typers[0]} is typing`}
      </span>

      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
