import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";
import { Id } from "./_generated/dataModel";

export const getOrCreatechat = mutation({
  args: { otherUserId: v.id("users") },
  handler: async (ctx, { otherUserId }) => {
    const me = await getCurrentUser(ctx);

    // Canonical ordering so we always find the same row
    const ids: [Id<"users">, Id<"users">] =
      me._id < otherUserId
        ? [me._id, otherUserId]
        : [otherUserId, me._id];

    // Look for existing chat
    const all = await ctx.db.query("chats").collect();
    const existing = all.find(
      (c) =>
        c.participantIds.length === 2 &&
        c.participantIds.includes(ids[0]) &&
        c.participantIds.includes(ids[1])
    );

    if (existing) return existing._id;

    const convId = await ctx.db.insert("chats", {
      participantIds: ids,
      lastMessageTime: Date.now(),
    });

    return convId;
  },
});

export const listMychats = query({
  args: {},
  handler: async (ctx) => {
    const me = await getCurrentUser(ctx);

    const all = await ctx.db
      .query("chats")
      .order("desc")
      .collect();

    const mine = all.filter((c) => c.participantIds.includes(me._id));

    const now = Date.now();
    // Hydrate and calculate unread counts
    const result = await Promise.all(
      mine.map(async (chat) => {
        const otherId = chat.participantIds.find((id) => id !== me._id)!;
        const other = await ctx.db.get(otherId);

        // Get unread count
        const lastRead = chat.lastReadTimes?.[me._id] ?? 0;
        const unreads = await ctx.db
          .query("messages")
          .withIndex("by_chat", (q) => q.eq("chatId", chat._id))
          .filter((q) => q.gt(q.field("createdAt"), lastRead))
          .collect();

        return {
          ...chat,
          unreadCount: unreads.length,
          otherUser: other ? {
            ...other,
            isOnline: other.lastSeen ? now - other.lastSeen < 60000 : false,
          } : null,
        };
      })
    );

    // Sort by most recent message
    return result.sort(
      (a, b) => (b.lastMessageTime ?? 0) - (a.lastMessageTime ?? 0)
    );
  },
});

export const markAsRead = mutation({
  args: { chatId: v.id("chats") },
  handler: async (ctx, { chatId }) => {
    const me = await getCurrentUser(ctx);
    const chat = await ctx.db.get(chatId);
    if (!chat) return;

    const lastReadTimes = { ...(chat.lastReadTimes ?? {}) };
    lastReadTimes[me._id] = Date.now();

    await ctx.db.patch(chatId, { lastReadTimes });
  },
});

export const getUnreadCounts = query({
  args: {},
  handler: async (ctx) => {
    const me = await getCurrentUser(ctx);
    const chats = await ctx.db.query("chats").collect();
    const myChats = chats.filter((c) => c.participantIds.includes(me._id));

    let totalUnreadChats = 0;

    for (const chat of myChats) {
      const lastRead = chat.lastReadTimes?.[me._id] ?? 0;
      const unreads = await ctx.db
        .query("messages")
        .withIndex("by_chat", (q) => q.eq("chatId", chat._id))
        .filter((q) => q.gt(q.field("createdAt"), lastRead))
        .collect();

      if (unreads.length > 0) {
        totalUnreadChats++;
      }
    }

    return totalUnreadChats;
  },
});

export const sendMessage = mutation({
  args: {
    chatId: v.id("chats"),
    body: v.string(),
  },
  handler: async (ctx, { chatId, body }) => {
    const me = await getCurrentUser(ctx);

    const now = Date.now();

    await ctx.db.insert("messages", {
      chatId,
      senderId: me._id,
      body,
      createdAt: now,
    });

    // Update chat's last message & time, and update sender's read time
    const chat = await ctx.db.get(chatId);
    if (chat) {
      const lastReadTimes = { ...(chat.lastReadTimes ?? {}) };
      lastReadTimes[me._id] = now;
      
      await ctx.db.patch(chatId, {
        lastMessageBody: body,
        lastMessageTime: now,
        lastReadTimes,
      });
    }
  },
});

export const getMessages = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, { chatId }) => {
    const me = await getCurrentUser(ctx);

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) =>
        q.eq("chatId", chatId)
      )
      .order("asc")
      .collect();

    return messages.map((msg) => ({
      ...msg,
      isOwn: msg.senderId === me._id,
    }));
  },
});
