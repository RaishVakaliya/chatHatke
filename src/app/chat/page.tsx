"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import ChatSidebar from "@/components/ChatSidebar";
import ChatHeader from "@/components/ChatHeader";
import MessageList from "@/components/MessageList";
import ChatInput from "@/components/ChatInput";
import TopBar from "@/components/TopBar";
import { Chat } from "@/types";

export default function ChatPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  const [chatList, setChatList] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [showConversation, setShowConversation] = useState(false);

  const activeChat = chatList.find((c) => c.id === activeChatId) ?? null;

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, router]);

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    setShowConversation(true);
  };

  const handleBack = () => {
    setShowConversation(false);
  };

  const handleUserSelected = (user: any) => {
    setChatList((prev) => {
      const existing = prev.find((c) => c.user.id === user.clerkId);
      if (existing) {
        setActiveChatId(existing.id);
        setShowConversation(true);
        return prev;
      }

      const newId = `convex-${user._id}`;
      const displayName =
        user.fullName || user.username || user.email || "New user";

      const newChat: Chat = {
        id: newId,
        user: {
          id: user.clerkId,
          name: displayName,
          avatar: user.imageUrl ?? "",
          online: false,
        },
        lastMessage: "",
        timestamp: "Just now",
        unreadCount: 0,
        messages: [],
      };

      setActiveChatId(newId);
      setShowConversation(true);
      return [newChat, ...prev];
    });
  };

  if (!isLoaded) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div
      className="flex flex-col h-[100dvh] w-full"
      style={{ background: "var(--bg-primary)" }}
    >
      <TopBar />
      <div className="flex-1 flex overflow-hidden p-3 pt-3">
        <div
          className="flex flex-1 overflow-hidden rounded-2xl"
          style={{ border: "1px solid var(--border)" }}
        >
          {/* Sidebar */}
          <div
            className={`
              shrink-0 overflow-hidden transition-all duration-200
              ${showConversation ? "hidden" : "flex"} w-full
              md:flex md:w-[350px]
            `}
            style={{ borderRight: "1px solid var(--border)" }}
          >
            <div className="flex flex-col w-full">
              <ChatSidebar
                chats={chatList}
                activeChatId={activeChatId ?? ""}
                onSelectChat={handleSelectChat}
                onUserSelected={handleUserSelected}
              />
            </div>
          </div>

          {/* Chat area */}
          <div
            className={`
              flex-1 flex flex-col overflow-hidden
              ${showConversation ? "flex" : "hidden"}
              md:flex
            `}
          >
            {activeChat ? (
              <>
                <ChatHeader
                  user={activeChat.user}
                  onBack={handleBack}
                  showBack={showConversation}
                />
                <MessageList messages={activeChat.messages} />
                <ChatInput />
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-2">
                  <svg className="w-8 h-8 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-zinc-300">No chat selected</p>
                <p className="text-xs text-zinc-500">
                  Pick a conversation from the sidebar or start a new one with the <strong className="text-zinc-400">+</strong> button.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
