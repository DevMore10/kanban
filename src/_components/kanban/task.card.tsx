"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Pencil, Trash2, X } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import DatePicker from "@/components/ui/date-picker";

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

type FormValues = {
  title: string;
  description?: string;
  dueDate?: Date;
  tags?: string;
  assignedTo?: string;
};

export function TaskCard({ task }: { task: Task }) {
  const router = useRouter();
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Convex mutations
  const updateTask = useMutation(api.tasks.updateTask);
  const deleteTask = useMutation(api.tasks.deleteTask);
  

  // Form setup for editing
  const form = useForm<FormValues>({
    defaultValues: {
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      tags: task.tags ? task.tags.join(", ") : "",
      assignedTo: task.assignedTo,
    },
  });

  function formatDate(timestamp?: number) {
    if (!timestamp) return null;

    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  const dueDate = formatDate(task.dueDate);

  function handleEdit() {
    setIsViewOpen(false);
    setIsEditOpen(true);
  }

  function handleOpenDelete() {
    setIsViewOpen(false);
    setIsDeleteOpen(true);
  }

  async function handleDelete() {
    try {
      await deleteTask({ taskId: task._id });
      setIsDeleteOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  }

  async function onSubmit(values: FormValues) {
    try {
      // Process tags from comma-separated string to array
      const tagsArray = values.tags
        ? values.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : undefined;

      await updateTask({
        taskId: task._id,
        title: values.title,
        description: values.description,
        dueDate: values.dueDate ? values.dueDate.getTime() : undefined,
        tags: tagsArray,
        assignedTo: values.assignedTo,
      });

      setIsEditOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  }

  return (
    <>
      {/* Task Card */}
      <div
        className="bg-white rounded-md p-3 mb-2 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setIsViewOpen(true)}>
        <h4 className="font-medium text-gray-900 mb-1 pr-6">{task.title}</h4>

        {task.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
        )}

        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags?.map((tag) => (
            <Badge
              key={tag}
              variant="default"
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

      {/* View Task Dialog */}
      <Dialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{task.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {task.description && (
              <div>
                <h4 className="text-sm font-medium mb-1">Description</h4>
                <p className="text-sm text-gray-600">{task.description}</p>
              </div>
            )}

            {task.tags && task.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {task.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {task.assignedTo && (
              <div>
                <h4 className="text-sm font-medium mb-1">Assigned To</h4>
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarFallback className="text-xs">
                      {task.assignedTo.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{task.assignedTo}</span>
                </div>
              </div>
            )}

            {dueDate && (
              <div>
                <h4 className="text-sm font-medium mb-1">Due Date</h4>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">{dueDate}</span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              variant="destructive"
              onClick={handleOpenDelete}
              className="flex items-center gap-1">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <Button
              onClick={handleEdit}
              className="flex items-center gap-1">
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Task title"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Task description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        setDate={(date) => field.onChange(date)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma separated)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="feature, bug, ui"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned To</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="User ID"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task "{task.title}" and
              remove it from the project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
