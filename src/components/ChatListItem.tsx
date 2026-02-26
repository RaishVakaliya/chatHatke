"use client";

import { Chat } from "@/types";
import UserAvatar from "./UserAvatar";
import { Check, CheckCheck } from "lucide-react";

interface ChatListItemProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
}

export default function ChatListItem({
  chat,
  isActive,
  onClick,
}: ChatListItemProps) {
  const hasUnread = chat.unreadCount > 0;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150 text-left group ${
        isActive ? "bg-(--active-chat)" : "hover:bg-(--active-chat)/60"
      }`}
    >
      <UserAvatar user={chat.user} size="md" showOnline />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className="text-sm font-semibold text-(--text-primary) truncate">
            {chat.user.name}
          </span>
          <span className="text-[11px] text-(--text-secondary) shrink-0 whitespace-nowrap">
            {chat.timestamp}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 min-w-0">
            {!hasUnread && (
              <CheckCheck className="w-3.5 h-3.5 text-green-500 shrink-0" />
            )}
            {hasUnread && (
              <Check className="w-3.5 h-3.5 text-(--text-secondary) shrink-0" />
            )}
            <span className="text-xs text-(--text-secondary) truncate">
              {chat.lastMessage}
            </span>
          </div>
          {hasUnread && (
            <span className="shrink-0 w-5 h-5 rounded-full bg-green-500 text-white text-[10px] font-bold flex items-center justify-center">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
