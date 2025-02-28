import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { taskStatus } from "./schema";

export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    projectId: v.id("projects"),
    status: taskStatus,
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    assignedTo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = identity.tokenIdentifier;

    // Get the project
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Check authorization based on organization or creator
    if (project.orgId) {
      // For organization projects, check user's org membership
      const user = await ctx.db
        .query("users")
        .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", userId))
        .first();

      if (!user) {
        throw new Error("User not found");
      }

      // Check if user is in org OR if token includes orgId
      const hasAccess =
        user.orgIds?.some((item) => item.orgId === project.orgId) || userId.includes(project.orgId);

      if (!hasAccess) {
        throw new Error("Unauthorized: Not a member of this organization");
      }
    } else {
      // For personal projects, check creator
      if (project.createdBy !== userId) {
        throw new Error("Unauthorized: You don't have access to this project");
      }
    }

    // Get the max order of tasks in the same status column
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_projectId_status", (q) =>
        q.eq("projectId", args.projectId).eq("status", args.status)
      )
      .collect();

    const maxOrder = tasks.length > 0 ? Math.max(...tasks.map((task) => task.order)) : 0;

    return await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      projectId: args.projectId,
      status: args.status,
      order: maxOrder + 1, // Put it at the end of the column
      createdBy: userId,
      assignedTo: args.assignedTo,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      dueDate: args.dueDate,
      tags: args.tags,
    });
  },
});

export const getTasks = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = identity.tokenIdentifier;

    // Get the project
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Check authorization based on organization or creator
    if (project.orgId) {
      // For organization projects, check user's org membership
      const user = await ctx.db
        .query("users")
        .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", userId))
        .first();

      if (!user) {
        throw new Error("User not found");
      }

      // Check if user is in org OR if token includes orgId
      const hasAccess =
        user.orgIds?.some((item) => item.orgId === project.orgId) || userId.includes(project.orgId);

      if (!hasAccess) {
        throw new Error("Unauthorized: Not a member of this organization");
      }
    } else {
      // For personal projects, check creator
      if (project.createdBy !== userId) {
        throw new Error("Unauthorized: You don't have access to this project");
      }
    }

    // Get all tasks for the project, sorted by order within each status
    return await ctx.db
      .query("tasks")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .collect();
  },
});

export const getTasksByStatus = query({
  args: {
    projectId: v.id("projects"),
    status: taskStatus,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = identity.tokenIdentifier;

    // Get the project
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Check authorization based on organization or creator
    if (project.orgId) {
      // For organization projects, check user's org membership
      const user = await ctx.db
        .query("users")
        .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", userId))
        .first();

      if (!user) {
        throw new Error("User not found");
      }

      // Check if user is in org OR if token includes orgId
      const hasAccess =
        user.orgIds?.some((item) => item.orgId === project.orgId) || userId.includes(project.orgId);

      if (!hasAccess) {
        throw new Error("Unauthorized: Not a member of this organization");
      }
    } else {
      // For personal projects, check creator
      if (project.createdBy !== userId) {
        throw new Error("Unauthorized: You don't have access to this project");
      }
    }

    // Get all tasks for the project with the specified status, sorted by order
    return await ctx.db
      .query("tasks")
      .withIndex("by_projectId_status", (q) =>
        q.eq("projectId", args.projectId).eq("status", args.status)
      )
      .collect();
  },
});

export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(taskStatus),
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    assignedTo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = identity.tokenIdentifier;

    // Get the task
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    // Get the project
    const project = await ctx.db.get(task.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Check authorization based on organization or creator
    if (project.orgId) {
      // For organization projects, check user's org membership
      const user = await ctx.db
        .query("users")
        .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", userId))
        .first();

      if (!user) {
        throw new Error("User not found");
      }

      // Check if user is in org OR if token includes orgId
      const hasAccess =
        user.orgIds?.some((item) => item.orgId === project.orgId) || userId.includes(project.orgId);

      if (!hasAccess) {
        throw new Error("Unauthorized: Not a member of this organization");
      }
    } else {
      // For personal projects, check creator
      if (project.createdBy !== userId) {
        throw new Error("Unauthorized: You don't have access to this project");
      }
    }

    const updates = {
      ...(args.title !== undefined && { title: args.title }),
      ...(args.description !== undefined && { description: args.description }),
      ...(args.status !== undefined && { status: args.status }),
      ...(args.dueDate !== undefined && { dueDate: args.dueDate }),
      ...(args.tags !== undefined && { tags: args.tags }),
      ...(args.assignedTo !== undefined && { assignedTo: args.assignedTo }),
      updatedAt: Date.now(),
    };

    await ctx.db.patch(args.taskId, updates);

    return await ctx.db.get(args.taskId);
  },
});

export const updateTaskStatus = mutation({
  args: {
    taskId: v.id("tasks"),
    status: taskStatus,
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = identity.tokenIdentifier;

    // Get the task
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    // Get the project
    const project = await ctx.db.get(task.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Check authorization based on organization or creator
    if (project.orgId) {
      // For organization projects, check user's org membership
      const user = await ctx.db
        .query("users")
        .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", userId))
        .first();

      if (!user) {
        throw new Error("User not found");
      }

      // Check if user is in org OR if token includes orgId
      const hasAccess =
        user.orgIds?.some((item) => item.orgId === project.orgId) || userId.includes(project.orgId);

      if (!hasAccess) {
        throw new Error("Unauthorized: Not a member of this organization");
      }
    } else {
      // For personal projects, check creator
      if (project.createdBy !== userId) {
        throw new Error("Unauthorized: You don't have access to this project");
      }
    }

    // Update the task status and order
    await ctx.db.patch(args.taskId, {
      status: args.status,
      order: args.order,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(args.taskId);
  },
});

// When updating task order due to drag and drop
export const reorderTasks = mutation({
  args: {
    projectId: v.id("projects"),
    status: taskStatus,
    taskIds: v.array(v.id("tasks")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = identity.tokenIdentifier;

    // Get the project
    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Check authorization based on organization or creator
    if (project.orgId) {
      // For organization projects, check user's org membership
      const user = await ctx.db
        .query("users")
        .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", userId))
        .first();

      if (!user) {
        throw new Error("User not found");
      }

      // Check if user is in org OR if token includes orgId
      const hasAccess =
        user.orgIds?.some((item) => item.orgId === project.orgId) || userId.includes(project.orgId);

      if (!hasAccess) {
        throw new Error("Unauthorized: Not a member of this organization");
      }
    } else {
      // For personal projects, check creator
      if (project.createdBy !== userId) {
        throw new Error("Unauthorized: You don't have access to this project");
      }
    }

    // Update order for each task
    for (let i = 0; i < args.taskIds.length; i++) {
      await ctx.db.patch(args.taskIds[i], {
        status: args.status,
        order: i,
        updatedAt: Date.now(),
      });
    }
  },
});

export const deleteTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = identity.tokenIdentifier;

    // Get the task
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    // Get the project
    const project = await ctx.db.get(task.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    // Check authorization based on organization or creator
    if (project.orgId) {
      // For organization projects, check user's org membership
      const user = await ctx.db
        .query("users")
        .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", userId))
        .first();

      if (!user) {
        throw new Error("User not found");
      }

      // Check if user is in org OR if token includes orgId
      const hasAccess =
        user.orgIds?.some((item) => item.orgId === project.orgId) || userId.includes(project.orgId);

      if (!hasAccess) {
        throw new Error("Unauthorized: Not a member of this organization");
      }

      // Only allow admins to delete tasks or the creator of the task
      const orgMembership = user.orgIds?.find((org) => org.orgId === project.orgId);
      if (orgMembership && orgMembership.role !== "admin" && task.createdBy !== userId) {
        throw new Error(
          "Unauthorized: Only admins or the task creator can delete organization tasks"
        );
      }
    } else {
      // For personal projects, check creator
      if (project.createdBy !== userId) {
        throw new Error("Unauthorized: You don't have access to this project");
      }
    }

    await ctx.db.delete(args.taskId);
  },
});
