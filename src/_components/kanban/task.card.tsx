"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

type Task = {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "doing" | "completed";
  order: number;
  assignedTo?: string;
  dueDate?: number;
  tags?: string[];
  // other task properties
};

export function TaskCard({ task }: { task: Task }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  function formatDate(timestamp?: number) {
    if (!timestamp) return null;

    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  const dueDate = formatDate(task.dueDate);

  return (
    <div
      className="bg-white rounded-md p-3 mb-2 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => setIsOpen(true)}>
      <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>

      {task.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-1 mb-3">
        {task.tags?.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex justify-between items-center mt-2">
        {task.assignedTo && (
          <Avatar className="h-6 w-6">
            <AvatarImage src="" />
            <AvatarFallback className="text-xs">
              {task.assignedTo.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}

        {dueDate && (
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{dueDate}</span>
          </div>
        )}
      </div>
    </div>
  );
}

