import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Called when user starts or continues typing
export const setTyping = mutation({
  args: { chatId: v.id("chats") },
  handler: async (ctx, { chatId }) => {
    const me = await getCurrentUser(ctx);
    if (!me) return;

    const now = Date.now();

    // Try to find existing row for this user in this chat
    const existing = await ctx.db
      .query("typing")
      .withIndex("by_chat", (q) => q.eq("chatId", chatId))
      .filter((q) => q.eq(q.field("userId"), me._id))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { updatedAt: now });
    } else {
      await ctx.db.insert("typing", { chatId, userId: me._id, updatedAt: now });
    }
  },
});

// Called when user sends message or explicitly stops typing
export const clearTyping = mutation({
  args: { chatId: v.id("chats") },
  handler: async (ctx, { chatId }) => {
    const me = await getCurrentUser(ctx);
    if (!me) return;

    const existing = await ctx.db
      .query("typing")
      .withIndex("by_chat", (q) => q.eq("chatId", chatId))
      .filter((q) => q.eq(q.field("userId"), me._id))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

export const getTypers = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, { chatId }) => {
    const me = await getCurrentUser(ctx);
    if (!me) return [];

    const cutoff = Date.now() - 3000; // 3s window (generous for network lag)

    const records = await ctx.db
      .query("typing")
      .withIndex("by_chat", (q) => q.eq("chatId", chatId))
      .collect();

    // Filter: not me, and updated within the last 3s
    const activeTypers = records.filter(
      (r) => r.userId !== me._id && r.updatedAt > cutoff,
    );

    // Hydrate with user names
    const typers = await Promise.all(
      activeTypers.map(async (r) => {
        const user = await ctx.db.get(r.userId);
        if (!user) return null;
        return user.fullName || user.username || user.email || "Someone";
      }),
    );

    return typers.filter(Boolean) as string[];
  },
});
