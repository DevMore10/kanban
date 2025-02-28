"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Id } from "../../../convex/_generated/dataModel";
import { SortableTaskCard } from "./sortable-task-card";
import { AddTaskButton } from "./add-task-button";

type Task = {
  _id: Id<"tasks">; // Document ID from Convex
  title: string;
  description?: string;
  status: "todo" | "doing" | "completed";
  order: number;
  projectId: Id<"projects">; // Reference to project document
  createdBy: string; // User ID
  assignedTo?: string; // Optional user ID
  createdAt: number; // Timestamp
  updatedAt: number; // Timestamp
  dueDate?: number; // Optional timestamp
  tags?: string[]; // Optional array of tags
};

export function KanbanColumn({
  id,
  title,
  tasks,
  projectId,
}: {
  id: string;
  title: string;
  tasks: Task[];
  projectId: Id<"projects">;
}) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-100 rounded-lg p-4 w-80 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-700">{title}</h3>
        <span className="bg-gray-200 text-gray-600 rounded-full px-2 py-1 text-xs">
          {tasks.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        <SortableContext
          items={tasks.map((t) => t._id)}
          strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTaskCard
              key={task._id}
              task={task}
            />
          ))}
        </SortableContext>
      </div>

      <AddTaskButton
        projectId={projectId}
        status={id as "todo" | "doing" | "completed"}
      />
    </div>
  );
}
