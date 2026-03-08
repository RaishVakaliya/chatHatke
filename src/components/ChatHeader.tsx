"use client";

import { Video, Phone, MoreHorizontal, ArrowLeft } from "lucide-react";
import UserAvatar from "./UserAvatar";

interface OtherUser {
  fullName?: string;
  username?: string;
  email?: string;
  imageUrl?: string;
  isOnline?: boolean;
}

interface ChatHeaderProps {
  otherUser: OtherUser | null;
  onBack?: () => void;
  showBack?: boolean;
}

export default function ChatHeader({
  otherUser,
  onBack,
  showBack,
}: ChatHeaderProps) {
  const name =
    otherUser?.fullName ??
    otherUser?.username ??
    otherUser?.email ??
    "Deleted User";

  return (
    <div
      className="flex items-center justify-between pr-4 py-3 shrink-0 md:pl-4"
      style={{
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-sidebar)",
      }}
    >
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={onBack}
            className="w-8 h-8 md:hidden rounded-full flex items-center justify-center text-(--text-secondary) hover:bg-(--active-chat) transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}

        <UserAvatar user={otherUser} size="md" showOnline />

        <div>
          <div className="text-sm font-semibold text-(--text-primary) leading-tight">
            {name}
          </div>
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
