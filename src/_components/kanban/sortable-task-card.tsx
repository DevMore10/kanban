"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Id } from "../../../convex/_generated/dataModel";
import { TaskCard } from "./task.card";

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

export function SortableTaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}>
      <TaskCard task={task} />
    </div>
  );
}
