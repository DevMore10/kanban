"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function TaskGenerator({ projectId }: { projectId: Id<"projects"> }) {
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const createTask = useMutation(api.tasks.createTask);

  async function generateTasks() {
    if (!inputText.trim()) return;

    setIsGenerating(true);

    try {
      // Call to Groq or similar LLM API
      const response = await fetch("/api/generate-tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText, projectId: projectId }),
      });

      if (!response.ok) throw new Error("Failed to generate tasks");

      const data = await response.json();
      const generatedTasks = data.tasks;

      // Create each task in Convex
      for (const task of generatedTasks) {
        await createTask({
          title: task.title,
          description: task.description,
          projectId: projectId,
          status: "todo", // Always place in Todo column
          tags: task.tags,
          dueDate: task.dueDate,
        });
      }

      // Clear the input area and close modal after successful generation
      setInputText("");
      setOpen(false);
    } catch (error) {
      console.error("Error generating tasks:", error);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto mb-4">
          <Plus className="h-4 w-4 mr-2" />
          Generate Tasks with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Generate Tasks with AI</DialogTitle>
          <DialogDescription>
            Describe the tasks you want to create and let AI generate them for you.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
          <Textarea
            placeholder="Describe the tasks you want to generate. For example: 'Create a marketing campaign for our new product launch, including social media posts, email sequences, and PR outreach.'"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={5}
            className="resize-none"
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isGenerating}>
            Cancel
          </Button>
          <Button
            onClick={generateTasks}
            disabled={isGenerating || !inputText.trim()}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Tasks"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
