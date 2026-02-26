"use client";

import { Chat } from "@/types";
import ChatListItem from "./ChatListItem";
import { Search, Plus } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import UserPicker from "./UserPicker";

interface ChatSidebarProps {
  chats: Chat[];
  activeChatId: string;
  onSelectChat: (chatId: string) => void;
  onUserSelected: (user: any) => void;
}

export default function ChatSidebar({
  chats,
  activeChatId,
  onSelectChat,
  onUserSelected,
}: ChatSidebarProps) {
  const [search, setSearch] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);

  const filtered = chats.filter((c) =>
    c.user.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: "var(--bg-sidebar)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-4">
        <h1 className="text-xl font-bold text-(--text-primary)">Chats</h1>

        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <button
              className="w-8 h-8 border-1 rounded-full flex items-center justify-center text-(--text-secondary) hover:bg-(--active-chat) transition-colors"
              aria-label="New chat"
            >
              <Plus className="w-4 h-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            align="end"
            sideOffset={8}
            className="w-80 p-4 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl"
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

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto custom-scroll px-2 pb-4 space-y-0.5">
        {filtered.map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            isActive={activeChatId === chat.id}
            onClick={() => onSelectChat(chat.id)}
          />
        ))}
      </div>
    </div>
  );
}
