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

    // Hydrate with the other user's info
    const result = await Promise.all(
      mine.map(async (conv) => {
        const otherId = conv.participantIds.find((id) => id !== me._id)!;
        const other = await ctx.db.get(otherId);
        return {
          ...conv,
          otherUser: other,
        };
      })
    );

    // Sort by most recent message (descending)
    return result.sort(
      (a, b) => (b.lastMessageTime ?? 0) - (a.lastMessageTime ?? 0)
    );
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

    // Update chat's last message & time
    await ctx.db.patch(chatId, {
      lastMessageBody: body,
      lastMessageTime: now,
    });
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
