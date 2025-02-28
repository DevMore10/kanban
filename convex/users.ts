import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getUser = query({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .first();
  },
});

export const createUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      name: args.name,
      image: args.image,
      orgIds: [],
    });
  },
});

export const updateUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const updates = {
      ...(args.name !== undefined && { name: args.name }),
      ...(args.image !== undefined && { image: args.image }),
    };

    await ctx.db.patch(user._id, updates);
  },
});

export const addOrgIdToUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    orgId: v.string(),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const orgIds = user.orgIds || [];
    const existingOrgIndex = orgIds.findIndex((org) => org.orgId === args.orgId);

    if (existingOrgIndex !== -1) {
      // Update existing org
      orgIds[existingOrgIndex].role = args.role;
    } else {
      // Add new org
      orgIds.push({ orgId: args.orgId, role: args.role });
    }

    await ctx.db.patch(user._id, { orgIds });
  },
});

export const updateRoleInOrgForUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    orgId: v.string(),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const orgIds = user.orgIds || [];
    const existingOrgIndex = orgIds.findIndex((org) => org.orgId === args.orgId);

    if (existingOrgIndex !== -1) {
      // Update existing org
      orgIds[existingOrgIndex].role = args.role;
      await ctx.db.patch(user._id, { orgIds });
    }
  },
});
