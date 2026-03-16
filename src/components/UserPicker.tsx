"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Image from "next/image";
import { Search } from "lucide-react";

interface UserPickerProps {
  onSelectUser: (user: any) => void;
  onClose?: () => void;
}

export default function UserPicker({ onSelectUser, onClose }: UserPickerProps) {
  const users = useQuery(api.users.listOtherUsers, {});
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!users) return [];
    const term = search.toLowerCase();
    return users.filter((u: any) => {
      const name =
        (u.fullName as string | undefined) ??
        (u.username as string | undefined) ??
        (u.email as string | undefined) ??
        "";
      return name.toLowerCase().includes(term);
    });
  }, [users, search]);

  return (
    <div className="flex flex-col h-full p-4 gap-3">
      <div>
        <h2 className="text-sm font-semibold text-white">Start new chat</h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Choose a user to start a chat.
        </p>
      </div>

      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800">
        <Search className="w-4 h-4 text-zinc-500 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          autoFocus
          className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-0.5 custom-scroll pr-1">
        {filtered.length === 0 && (
          <div className="text-xs text-zinc-500 py-6 text-center">
            {users ? "No users found." : "Loading users..."}
          </div>
        )}

        {filtered.map((u: any) => {
          const name = u.fullName ?? u.username ?? u.email ?? "New user";
          return (
            <button
              key={u._id}
              onClick={() => {
                onSelectUser(u);
                onClose?.();
              }}
              className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-zinc-900 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden bg-zinc-700 flex items-center justify-center text-xs font-semibold text-white shrink-0">
                {u.imageUrl ? (
                  <Image src={u.imageUrl} alt={name} width={36} height={36} />
                ) : (
                  <span>
                    {name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex flex-col justify-center">
                <div className="text-sm text-white font-medium truncate">
                  {name}
                </div>
                <div className="text-[10px] text-zinc-500 truncate italic">
                  {u.about || "Hey there! I am using ChatHatke"}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
