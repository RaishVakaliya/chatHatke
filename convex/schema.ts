import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    fullName: v.optional(v.string()),
    username: v.optional(v.string()),
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    clerkId: v.string(),
    lastSeen: v.optional(v.number()),
    about: v.optional(v.string()),
  }).index("by_clerkId", ["clerkId"]),

  chats: defineTable({
    participantIds: v.array(v.id("users")),
    lastMessageBody: v.optional(v.string()),
    lastMessageTime: v.optional(v.number()),
    lastReadTimes: v.optional(v.any()),
  }).index("by_lastMessageTime", ["lastMessageTime"]),

  messages: defineTable({
    chatId: v.id("chats"),
    senderId: v.id("users"),
    body: v.string(),
    createdAt: v.number(),
  }).index("by_chat", ["chatId", "createdAt"]),

  typing: defineTable({
    chatId: v.id("chats"),
    userId: v.id("users"),
    updatedAt: v.number(),
  }).index("by_chat", ["chatId"]),
});
