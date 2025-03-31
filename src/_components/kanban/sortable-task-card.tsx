"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Id } from "../../../convex/_generated/dataModel";
import { TaskCard } from "./task.card";
import { GripVertical } from "lucide-react";

type Task = {
  _id: Id<"tasks">;
  title: string;
  description?: string;
  status: "todo" | "doing" | "completed";
  order: number;
  projectId: Id<"projects">;
  createdBy: string;
  assignedTo?: string;
  createdAt: number;
  updatedAt: number;
  dueDate?: number;
  tags?: string[];
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
      className="relative">
      <div
        className="absolute top-3 right-3 p-1 cursor-grab rounded hover:bg-gray-100 z-10"
        {...attributes}
        {...listeners}>
        <GripVertical className="h-4 w-4 text-gray-400" />
      </div>
      <TaskCard task={task} />
    </div>
  );
}
