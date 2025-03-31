"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Id } from "../../../convex/_generated/dataModel";
import { SortableTaskCard } from "./sortable-task-card";
import { AddTaskButton } from "./add-task-button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <Card
      ref={setNodeRef}
      className="w-80 flex flex-col h-full">
      <CardHeader className="flex flex-row justify-between items-center p-4">
        <CardTitle className="font-semibold text-gray-700">{title}</CardTitle>
        <Badge
          variant="default"
          className="bg-gray-200 text-gray-600 rounded-full px-2 py-1 text-xs">
          {tasks.length}
        </Badge>
      </CardHeader>

      <CardContent className="flex-1 p-4">
        <ScrollArea className="h-full">
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
        </ScrollArea>
      </CardContent>

      {/* Conditionally render the AddTaskButton only for the "todo" column */}
      {id === "todo" && (
        <div className="p-4">
          <AddTaskButton
            projectId={projectId}
            status={id as "todo" | "doing" | "completed"}
          />
        </div>
      )}
    </Card>
  );
}
