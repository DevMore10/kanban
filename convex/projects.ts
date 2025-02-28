import { v, ConvexError } from "convex/values";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";

async function hasAccessToOrg(ctx: QueryCtx | MutationCtx, orgId?: string) {
  console.log("123", orgId);
  const identity = await ctx.auth.getUserIdentity();
  console.log(identity);

  if (!identity) {
    throw new ConvexError("Unauthorized");
  }

  const userId = identity.tokenIdentifier;

  const user = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", userId))
    .first();

  if (!user) {
    throw new ConvexError("User not found");
  }

  // If no orgId is provided, we're checking for personal access
  if (!orgId) {
    return { user, userId };
  }

  // Check if user is in the organization or if token includes orgId as fallback
  const hasAccess = user.orgIds?.some((item) => item.orgId === orgId) || userId.includes(orgId);

  if (!hasAccess) {
    throw new ConvexError("You do not have access to this organization");
  }

  return { user, userId };
}

function checkAdminAccess(user: any, orgId: string) {
  const orgMembership = user.orgIds?.find((org: any) => org.orgId === orgId);
  if (orgMembership && orgMembership.role !== "admin") {
    throw new ConvexError("Unauthorized: Only admins can perform this action");
  }
  return true;
}

export const createProject = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    orgId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId } = await hasAccessToOrg(ctx, args.orgId);

    const projectId = await ctx.db.insert("projects", {
      name: args.name,
      description: args.description,
      orgId: args.orgId,
      createdBy: userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      archived: false,
    });

    return projectId;
  },
});

export const getProjects = query({
  args: {
    orgId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const { userId } = await hasAccessToOrg(ctx, args.orgId);

    let projects;

    if (args.orgId) {
      // Get all non-archived projects for this organization
      projects = await ctx.db
        .query("projects")
        .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
        .collect();
    } else {
      // Get personal projects (no orgId) created by this user
      projects = await ctx.db
        .query("projects")
        .withIndex("by_createdBy", (q) => q.eq("createdBy", userId))
        .collect();
    }

    return projects;
  },
});

export const updateProject = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get the project
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new ConvexError("Project not found");
    }

    // Check authorization based on organization or creator
    const { user, userId } = await hasAccessToOrg(ctx, project.orgId);

    if (project.orgId) {
      // For organization projects, check admin rights
      checkAdminAccess(user, project.orgId);
    } else {
      // For personal projects, check creator
      if (project.createdBy !== userId) {
        throw new ConvexError("Unauthorized: You didn't create this project");
      }
    }

    const updates = {
      ...(args.name !== undefined && { name: args.name }),
      ...(args.description !== undefined && { description: args.description }),
      updatedAt: Date.now(),
    };

    await ctx.db.patch(args.projectId, updates);
  },
});

export const getProject = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    // Get the project
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new ConvexError("Project not found");
    }

    // Check authorization based on organization or creator
    const { userId } = await hasAccessToOrg(ctx, project.orgId);

    if (!project.orgId && project.createdBy !== userId) {
      // For personal projects, check creator
      throw new ConvexError("Unauthorized: You didn't create this project");
    }

    return project;
  },
});

export const archiveProject = mutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    // Get the project
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new ConvexError("Project not found");
    }

    // Check authorization based on organization or creator
    const { user, userId } = await hasAccessToOrg(ctx, project.orgId);

    if (project.orgId) {
      // For organization projects, check admin rights
      checkAdminAccess(user, project.orgId);
    } else {
      // For personal projects, check creator
      if (project.createdBy !== userId) {
        throw new ConvexError("Unauthorized: You didn't create this project");
      }
    }

    await ctx.db.patch(args.projectId, {
      archived: true,
      updatedAt: Date.now(),
    });
  },
});
