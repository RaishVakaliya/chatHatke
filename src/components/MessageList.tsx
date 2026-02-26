"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import MessageBubble from "./MessageBubble";

interface MessageListProps {
  chatId: Id<"chats">;
}

function getDayLabel(ts: number): string {
  const msgDate = new Date(ts);
  const today = new Date();

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (sameDay(msgDate, today)) return "Today";

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (sameDay(msgDate, yesterday)) return "Yesterday";

  const dd = String(msgDate.getDate()).padStart(2, "0");
  const mm = String(msgDate.getMonth() + 1).padStart(2, "0");
  const yyyy = msgDate.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function DateSeparator({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center my-3">
      <span
        className="px-3 py-1 rounded-full text-[11px] font-medium"
        style={{
          background: "var(--active-chat)",
          color: "var(--text-secondary)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function MessageList({ chatId }: MessageListProps) {
  const messages = useQuery(api.chats.getMessages, { chatId });
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="flex-1 overflow-y-auto custom-scroll px-4 py-4"
      style={{ background: "var(--bg-chat)" }}
    >
      {messages === undefined && (
        <div className="flex items-center justify-center h-full">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-500 border-t-transparent" />
        </div>
      )}

      {messages?.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <p className="text-xs text-zinc-500">No messages yet. Say hello! 👋</p>
        </div>
      )}

      {messages?.map(
        (
          msg: { _id: string; body: string; isOwn: boolean; createdAt: number },
          index: number
        ) => {
          const prev = messages[index - 1] as typeof msg | undefined;
          const prevLabel = prev ? getDayLabel(prev.createdAt) : null;
          const thisLabel = getDayLabel(msg.createdAt);
          const showSeparator = thisLabel !== prevLabel;

          return (
            <div key={msg._id}>
              {showSeparator && <DateSeparator label={thisLabel} />}
              <div className="mb-1">
                <MessageBubble
                  body={msg.body}
                  isOwn={msg.isOwn}
                  createdAt={msg.createdAt}
                />
              </div>
            </div>
          );
        }
      )}

      <div ref={bottomRef} />
    </div>
  );
}
