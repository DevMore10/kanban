"use client";


import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "convex/react";
import { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";

export function AddTaskButton({
  projectId,
  status,
}: {
  projectId: Id<"projects">;
  status: "todo" | "doing" | "completed";
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const createTask = useMutation(api.tasks.createTask);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) return;

    await createTask({
      title,
      description: description || undefined,
      projectId,
      status,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setIsAdding(false);
  }

  if (!isAdding) {
    return (
      <Button
        variant="ghost"
        className="w-full mt-2 text-gray-500 hover:text-gray-700 flex items-center justify-center"
        onClick={() => setIsAdding(true)}>
        <Plus className="h-4 w-4 mr-1" />
        Add Task
      </Button>
    );
  }

  return (
    <Card className="mt-2">
      <CardContent className="p-3">
        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-2"
            autoFocus
          />
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mb-2 text-sm"
            rows={2}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm">
              Add
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
