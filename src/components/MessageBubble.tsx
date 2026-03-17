import { Check, Smile } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState, useRef, useEffect } from "react";

interface MessageBubbleProps {
  messageId: Id<"messages">;
  body: string;
  isOwn: boolean;
  createdAt: number;
  reactions?: { userId: Id<"users">; emoji: string }[];
}

const QUICK_EMOJIS = ["❤️", "😂", "😮", "😢", "🙏", "👍"];

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MessageBubble({
  messageId,
  body,
  isOwn,
  createdAt,
  reactions = [],
}: MessageBubbleProps) {
  const time = formatTime(createdAt);
  const toggleReaction = useMutation(api.chats.toggleReaction);
  const [showQuickReactions, setShowQuickReactions] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowQuickReactions(false);
      }
    }
    if (showQuickReactions) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showQuickReactions]);

  const groupedReactions = reactions.reduce(
    (acc, curr) => {
      acc[curr.emoji] = (acc[curr.emoji] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const hasReactions = Object.keys(groupedReactions).length > 0;

  return (
    <div
      className={`flex ${isOwn ? "justify-end" : "justify-start"} group items-center gap-2 ${hasReactions ? "mb-3" : "mb-1"}`}
    >
      {isOwn && (
        <div className="relative" ref={isOwn ? menuRef : null}>
          {showQuickReactions && (
            <div className="absolute right-0 bottom-full mb-2 flex items-center gap-1.5 p-1.5 rounded-full shadow-2xl bg-[var(--bg-sidebar)] border border-[var(--border)] animate-in fade-in zoom-in-95 duration-200 z-[100]">
              {QUICK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    toggleReaction({ messageId, emoji });
                    setShowQuickReactions(false);
                  }}
                  className="hover:scale-125 transition-all duration-200 text-lg sm:text-xl p-0.5"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={() => setShowQuickReactions(!showQuickReactions)}
            className="opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-full hover:bg-[var(--active-chat)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            <Smile className="w-4 h-4" />
          </button>
        </div>
      )}

      <div
        className={`relative px-3.5 py-2 rounded-2xl max-w-[75%] ${
          isOwn ? "rounded-br-sm" : "rounded-bl-sm"
        }`}
        style={{
          background: isOwn ? "var(--bg-bubble-sent)" : "var(--bg-bubble-recv)",
          color: isOwn ? "var(--text-bubble-sent)" : "var(--text-bubble-recv)",
          paddingBottom: hasReactions ? "0.8rem" : "0.5rem",
        }}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {body}
          <span
            className="inline-block select-none pointer-events-none"
            style={{ width: isOwn ? "72px" : "44px" }}
            aria-hidden
          />
        </p>

        <span
          className="absolute bottom-1.5 right-2.5 flex items-center gap-0.5 opacity-60"
          style={{ fontSize: "10px", lineHeight: 1 }}
        >
          {time}
          {isOwn && (
            <Check
              className="w-3 h-3 text-green-400 opacity-100"
              style={{ opacity: 1 }}
            />
          )}
        </span>

        {hasReactions && (
          <div
            className={`absolute -bottom-2 ${isOwn ? "right-2" : "left-2"} flex items-center gap-0.5 px-1 py-0.5 rounded-full shadow-sm border border-[var(--border)] bg-[var(--bg-secondary)] hover:scale-105 transition-transform cursor-default select-none reaction-badge z-10`}
          >
            {Object.keys(groupedReactions).map((emoji) => (
              <span key={emoji} className="text-[12px] leading-none">
                {emoji}
              </span>
            ))}
            {reactions.length > 1 && (
              <span className="text-[10px] text-[var(--text-secondary)] font-medium px-0.5">
                {reactions.length}
              </span>
            )}
          </div>
        )}
      </div>

      {!isOwn && (
        <div className="relative" ref={!isOwn ? menuRef : null}>
          {showQuickReactions && (
            <div className="absolute left-0 bottom-full mb-2 flex items-center gap-1.5 p-1.5 rounded-full shadow-2xl bg-[var(--bg-sidebar)] border border-[var(--border)] animate-in fade-in zoom-in-95 duration-200 z-[100]">
              {QUICK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    toggleReaction({ messageId, emoji });
                    setShowQuickReactions(false);
                  }}
                  className="hover:scale-125 transition-all duration-200 text-lg sm:text-xl p-0.5"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={() => setShowQuickReactions(!showQuickReactions)}
            className="opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-full hover:bg-[var(--active-chat)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            <Smile className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
