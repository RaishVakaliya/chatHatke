"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import MessageBubble from "./MessageBubble";

interface MessageListProps {
  chatId: Id<"chats">;
}

export default function MessageList({ chatId }: MessageListProps) {
  const messages = useQuery(api.chats.getMessages, { chatId });
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="flex-1 overflow-y-auto custom-scroll px-4 py-4 space-y-2"
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

      {messages?.map((msg: { _id: string; body: string; isOwn: boolean; createdAt: number }) => (
        <MessageBubble
          key={msg._id}
          body={msg.body}
          isOwn={msg.isOwn}
          createdAt={msg.createdAt}
        />
      ))}

      <div ref={bottomRef} />
    </div>
  );
}
