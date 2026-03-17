import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import MessageBubble from "./MessageBubble";
import { ArrowDown } from "lucide-react";
import TypingIndicator from "./TypingIndicator";

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
  const sendHello = useMutation(api.chats.sendMessage);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showNewMessages, setShowNewMessages] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const distanceToBottom =
      target.scrollHeight - target.scrollTop - target.clientHeight;

    const atBottom = distanceToBottom < 100;
    setIsAtBottom(atBottom);

    if (atBottom) {
      setShowNewMessages(false);
    }
  };

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (!messages || messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];

    if (isAtBottom || lastMessage.isOwn) {
      scrollToBottom(isAtBottom ? "smooth" : "auto");
      setShowNewMessages(false);
    } else {
      setShowNewMessages(true);
    }
  }, [messages]);

  return (
    <div className="flex-1 relative overflow-hidden flex flex-col">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto custom-scroll px-4 py-4"
        style={{ background: "var(--bg-chat)" }}
      >
        {messages === undefined && (
          <div className="flex items-center justify-center h-full">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-500 border-t-transparent" />
          </div>
        )}

        {messages?.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <p className="text-xs text-zinc-500">
              No messages yet. Say hello! 👋
            </p>
            <button
              onClick={() =>
                sendHello({ chatId, body: "Hello! 👋" }).catch(() => {})
              }
              className="px-4 py-2 rounded-full text-xs font-semibold transition-all hover:scale-105 active:scale-95"
              style={{
                background: "var(--active-chat)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
              }}
            >
              Say Hello! 👋
            </button>
          </div>
        )}

        {messages?.map(
          (
            msg: {
              _id: Id<"messages">;
              body: string;
              isOwn: boolean;
              createdAt: number;
              reactions?: { userId: Id<"users">; emoji: string }[];
            },
            index: number,
          ) => {
            const prev = messages[index - 1] as typeof msg | undefined;
            const prevLabel = prev ? getDayLabel(prev.createdAt) : null;
            const thisLabel = getDayLabel(msg.createdAt);
            const showSeparator = thisLabel !== prevLabel;

            return (
              <div key={msg._id}>
                {showSeparator && <DateSeparator label={thisLabel} />}
                <div className="mb-2">
                  <MessageBubble
                    messageId={msg._id}
                    body={msg.body}
                    isOwn={msg.isOwn}
                    createdAt={msg.createdAt}
                    reactions={msg.reactions}
                  />
                </div>
              </div>
            );
          },
        )}

        <TypingIndicator chatId={chatId} />
        <div ref={bottomRef} className="h-2" />
      </div>

      {showNewMessages && (
        <button
          onClick={() => scrollToBottom()}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-(--active-chat) border border-(--border) rounded-full shadow-lg flex items-center gap-2 text-xs font-semibold text-(--text-primary) hover:scale-105 transition-transform animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <ArrowDown className="w-4 h-4 text-green-500" />
          <span>New messages</span>
        </button>
      )}
    </div>
  );
}
