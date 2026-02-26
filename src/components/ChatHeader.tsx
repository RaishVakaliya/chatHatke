"use client";

import { Video, Phone, MoreHorizontal, ArrowLeft } from "lucide-react";
import Image from "next/image";

interface OtherUser {
  fullName?: string;
  username?: string;
  email?: string;
  imageUrl?: string;
}

interface ChatHeaderProps {
  otherUser: OtherUser | null;
  onBack?: () => void;
  showBack?: boolean;
}

export default function ChatHeader({ otherUser, onBack, showBack }: ChatHeaderProps) {
  const name =
    otherUser?.fullName ??
    otherUser?.username ??
    otherUser?.email ??
    "Unknown";

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full overflow-hidden bg-zinc-700 flex items-center justify-center text-xs font-semibold text-white shrink-0">
          {otherUser?.imageUrl ? (
            <Image
              src={otherUser.imageUrl}
              alt={name}
              width={36}
              height={36}
              className="object-cover w-full h-full"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>

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
