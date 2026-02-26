"use client";

import Image from "next/image";

interface User {
  fullName?: string;
  username?: string;
  email?: string;
  imageUrl?: string;
  isOnline?: boolean;
}

interface UserAvatarProps {
  user: User | null;
  size?: "sm" | "md" | "lg";
  showOnline?: boolean;
}

const sizeMap = {
  sm: "w-8 h-8 text-[10px]",
  md: "w-10 h-10 text-xs",
  lg: "w-12 h-12 text-sm",
};

export default function UserAvatar({
  user,
  size = "md",
  showOnline,
}: UserAvatarProps) {
  const sizeClass = sizeMap[size];

  const name =
    user?.fullName ??
    user?.username ??
    user?.email ??
    "Unknown";

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`relative shrink-0 ${sizeClass}`}>
      {user?.imageUrl ? (
        <Image
          src={user.imageUrl}
          alt={name}
          width={size === "sm" ? 32 : size === "md" ? 40 : 48}
          height={size === "sm" ? 32 : size === "md" ? 40 : 48}
          className={`rounded-full object-cover ${sizeClass}`}
        />
      ) : (
        <div
          className={`rounded-full flex items-center justify-center font-semibold ${sizeClass}`}
          style={{
            background: "var(--active-chat)",
            color: "var(--text-primary)",
          }}
        >
          {initials}
        </div>
      )}
      {showOnline && user?.isOnline && (
        <span 
          className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2" 
          style={{ borderColor: "var(--bg-sidebar)" }}
        />
      )}
    </div>
  );
}
