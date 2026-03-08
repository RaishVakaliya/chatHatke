"use client";

import { useState, useEffect } from "react";
import { Bell, Sun, Moon, HelpCircle, LogOut } from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function TopBar() {
  const [dark, setDark] = useState(true);
  const { user } = useUser();
  const { signOut } = useClerk();

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : (user?.firstName?.[0]?.toUpperCase() ?? "U");
  const unreadChatsCount = useQuery(api.chats.getUnreadCounts) ?? 0;

  return (
    <div
      className="flex items-center justify-between px-4 py-2 shrink-0 relative"
      style={{
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-primary)",
      }}
    >
      {/* App Logo+Name */}
      <div className="flex items-center gap-2.5 select-none cursor-pointer">
        <Image
          src="/app_logo.png"
          alt="chatHatke logo"
          width={36}
          height={36}
          className="rounded-lg object-contain"
        />
        <span
          className="text-lg font-bold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          chat<span className="text-green-500">Hatke</span>
        </span>
      </div>

      {/* Right side icons */}
      <div className="flex items-center gap-1">
        <div className="relative">
          <button className="relative w-8 h-8 flex items-center justify-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--active-chat)] transition-colors">
            <Bell className="w-5 h-5" />

            {unreadChatsCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-green-700 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[var(--bg-primary)]">
                {unreadChatsCount}
              </span>
            )}
          </button>
        </div>
        <button
          onClick={() => setDark(!dark)}
          className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--active-chat)] transition-colors"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* profile avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-zinc-700 text-xs font-semibold text-white shrink-0 ml-1">
              {user?.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt={user.fullName || "Profile"}
                  width={32}
                  height={32}
                />
              ) : (
                <span>{initials}</span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            align="end"
            className="w-60 bg-zinc-900 border-zinc-800 text-sm rounded-xl p-0 overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-700 flex items-center justify-center text-xs font-semibold text-white">
                {user?.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt={user.fullName || "Profile"}
                    width={40}
                    height={40}
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <div className="min-w-0">
                <div className="text-sm text-zinc-300 font-semibold truncate">
                  {user?.fullName || user?.username || "User"}
                </div>
                <div className="text-xs text-zinc-400 truncate">
                  {user?.primaryEmailAddress?.emailAddress ??
                    user?.emailAddresses?.[0]?.emailAddress ??
                    ""}
                </div>
              </div>
            </div>

            <DropdownMenuItem
              className="flex items-center justify-center gap-2 px-3 py-2 text-zinc-300 cursor-pointer focus:bg-zinc-800 data-[highlighted]:bg-zinc-800 rounded-none"
              onClick={() => signOut({ redirectUrl: "/" })}
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
