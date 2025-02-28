import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const roles = v.union(v.literal("admin"), v.literal("member"));
export const taskStatus = v.union(v.literal("todo"), v.literal("doing"), v.literal("completed"));

export default defineSchema({
  // Users table (already in your schema)
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    orgIds: v.optional(
      v.array(
        v.object({
          orgId: v.string(),
          role: roles,
        })
      )
    ),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),

  // Projects table
  projects: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    orgId: v.optional(v.string()), // Optional organization ID
    createdBy: v.string(), // User ID who created the project
    createdAt: v.number(), // Timestamp
    updatedAt: v.number(), // Timestamp
    archived: v.boolean(), // For soft delete
  })
    .index("by_orgId", ["orgId"]) // For listing org projects
    .index("by_createdBy", ["createdBy"]), // For personal projects

  // Tasks table
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    projectId: v.id("projects"), // Reference to the project
    status: taskStatus, // "todo", "doing", "completed"
    order: v.number(), // For ordering tasks within a column
    createdBy: v.string(), // User ID who created the task
    assignedTo: v.optional(v.string()), // User ID assigned to the task
    createdAt: v.number(), // Timestamp
    updatedAt: v.number(), // Timestamp
    dueDate: v.optional(v.number()), // Optional due date
    tags: v.optional(v.array(v.string())), // Optional tags for filtering
  })
    .index("by_projectId", ["projectId"]) // For listing tasks in a project
    .index("by_projectId_status", ["projectId", "status"]), // For listing tasks by status
});
