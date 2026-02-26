"use client";

import { User } from "@/types";
import Image from "next/image";

interface UserAvatarProps {
  user: User;
  size?: "sm" | "md" | "lg";
  showOnline?: boolean;
}

const sizeMap = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

export default function UserAvatar({
  user,
  size = "md",
  showOnline,
}: UserAvatarProps) {
  const sizeClass = sizeMap[size];

  return (
    <div className={`relative shrink-0 ${sizeClass}`}>
      {user.avatar ? (
        <Image
          src={user.avatar}
          alt={user.name}
          width={size === "sm" ? 32 : size === "md" ? 40 : 48}
          height={size === "sm" ? 32 : size === "md" ? 40 : 48}
          className={`rounded-full object-cover ${sizeClass}`}
          unoptimized
        />
      ) : (
        <div
          className={`rounded-full flex items-center justify-center font-semibold ${sizeClass}`}
          style={{
            background: "var(--active-chat)",
            color: "var(--text-primary)",
          }}
        >
          {user.initials ||
            user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
        </div>
      )}
      {showOnline && user.online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-(--bg-sidebar)" />
      )}
    </div>
  );
}
