"use client";

import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { Search, Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import UserPicker from "./UserPicker";
import UserAvatar from "./UserAvatar";

interface ChatItem {
  _id: Id<"chats">;
  lastMessageBody?: string;
  lastMessageTime?: number;
  unreadCount?: number;
  otherUser: {
    _id: Id<"users">;
    fullName?: string;
    username?: string;
    email?: string;
    imageUrl?: string;
    isOnline?: boolean;
  } | null;
}

interface ChatSidebarProps {
  chats: ChatItem[];
  activeConvId: Id<"chats"> | null;
  onSelectChat: (id: Id<"chats">) => void;
  onUserSelected: (user: any) => void;
}

function formatTime(ts?: number) {
  if (!ts) return "";
  const d = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function ChatSidebar({
  chats,
  activeConvId,
  onSelectChat,
  onUserSelected,
}: ChatSidebarProps) {
  const [search, setSearch] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);

  const filtered = chats.filter((c) => {
    const name =
      c.otherUser?.fullName ??
      c.otherUser?.username ??
      c.otherUser?.email ??
      "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "var(--bg-sidebar)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-4">
        <h1 className="text-xl font-bold text-(--text-primary)">Chats</h1>

        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <button
              className="w-8 h-8 border border-(--border) rounded-full flex items-center justify-center text-(--text-secondary) hover:bg-(--active-chat) transition-colors"
              aria-label="New chat"
            >
              <Plus className="w-4 h-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            align="end"
            sideOffset={8}
            className="w-80 p-0 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
            style={{ height: "calc(100dvh - 9rem)" }}
          >
            <UserPicker
              onSelectUser={(user) => {
                onUserSelected(user);
                setPopoverOpen(false);
              }}
              onClose={() => setPopoverOpen(false)}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Search */}
      <div className="px-3 pb-3">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: "var(--active-chat)" }}
        >
          <Search className="w-4 h-4 text-(--text-secondary) shrink-0" />
          <input
            type="text"
            placeholder="Chats search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-(--text-primary) placeholder:text-(--text-secondary) outline-none"
          />
        </div>
      </div>

      {/* chat list */}
      <div className="flex-1 overflow-y-auto custom-scroll px-2 pb-4 space-y-0.5">
        {chats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-1">
              <Plus className="w-5 h-5 text-zinc-500" />
            </div>
            <p className="text-sm text-zinc-400 font-medium">No chats yet</p>
            <p className="text-xs text-zinc-500">
              Tap <strong className="text-zinc-400">+</strong> to start a new
              chat
            </p>
          </div>
        )}

        {filtered.map((conv) => {
          const name =
            conv.otherUser?.fullName ??
            conv.otherUser?.username ??
            conv.otherUser?.email ??
            "Unknown";
          const isActive = conv._id === activeConvId;
          const showCount = !isActive && (conv.unreadCount ?? 0) > 0;

          return (
            <button
              key={conv._id}
              onClick={() => onSelectChat(conv._id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150 text-left ${
                isActive ? "bg-(--active-chat)" : "hover:bg-(--active-chat)/60"
              }`}
            >
              <UserAvatar user={conv.otherUser} size="md" showOnline />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-(--text-primary) truncate">
                    {name}
                  </span>
                  <span
                    className={`text-[11px] shrink-0 whitespace-nowrap ${showCount ? "text-green-500 font-bold" : "text-(--text-secondary)"}`}
                  >
                    {formatTime(conv.lastMessageTime)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs text-(--text-secondary) truncate">
                    {conv.lastMessageBody ?? "Start a chat…"}
                  </div>
                  {showCount && (
                    <span className="w-4 h-4 rounded-full bg-green-700 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
