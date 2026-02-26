"use client";

import { User } from "@/types";
import UserAvatar from "./UserAvatar";
import { Video, Phone, MoreHorizontal, ArrowLeft } from "lucide-react";

interface ChatHeaderProps {
  user: User;
  onBack?: () => void;
  showBack?: boolean;
}

export default function ChatHeader({
  user,
  onBack,
  showBack,
}: ChatHeaderProps) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 shrink-0"
      style={{
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-sidebar)",
      }}
    >
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full flex items-center justify-center text-(--text-secondary) hover:bg-(--active-chat) transition-colors mr-1"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <UserAvatar user={user} size="md" showOnline />
        <div>
          <div className="text-sm font-semibold text-(--text-primary) leading-tight">
            {user.name}
          </div>
          {user.online && (
            <div className="text-xs text-green-500 font-medium">Online</div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-(--text-secondary) hover:bg-(--active-chat) transition-colors">
          <Video className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-(--text-secondary) hover:bg-(--active-chat) transition-colors">
          <Phone className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 rounded-full flex items-center justify-center text-(--text-secondary) hover:bg-(--active-chat) transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
