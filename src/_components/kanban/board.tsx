"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { KanbanColumn } from "./column";
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

export function KanbanBoard({ projectId }: { projectId: Id<"projects"> }) {
  const tasks = useQuery(api.tasks.getTasks, projectId ? { projectId } : "skip");
  const updateTaskStatus = useMutation(api.tasks.updateTaskStatus);
  const reorderTasks = useMutation(api.tasks.reorderTasks);

  const [columns, setColumns] = useState({
    todo: [] as Task[],
    doing: [] as Task[],
    completed: [] as Task[],
  });

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Update local state when tasks are loaded from the database
  useEffect(() => {
    if (tasks) {
      const grouped = tasks.reduce(
        (acc, task) => {
          const status = task.status as keyof typeof acc; // Ensure valid key
          acc[status].push(task);
          return acc;
        },
        { todo: [], doing: [], completed: [] } as {
          todo: Task[];
          doing: Task[];
          completed: Task[];
        }
      );

      // Sort tasks by order within each column
      (Object.keys(grouped) as Array<keyof typeof grouped>).forEach((status) => {
        grouped[status].sort((a, b) => a.order - b.order);
      });

      setColumns(grouped);
    }
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const taskId = active.id as Id<"tasks">;

    // Find the task in columns
    for (const status in columns) {
      const task = columns[status as keyof typeof columns].find((t) => t._id === taskId);
      if (task) {
        setActiveTask(task);
        break;
      }
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as Id<"tasks">;
    const overId = over.id;

    // Find active task source column
    let sourceColumn: string | null = null;
    for (const status in columns) {
      if (columns[status as keyof typeof columns].some((task) => task._id === activeId)) {
        sourceColumn = status;
        break;
      }
    }

    if (!sourceColumn) return;

    // Determine target column - if over a task, get its column, otherwise over.id is the column id
    let targetColumn: string | null = null;
    if (
      typeof overId === "string" &&
      (overId === "todo" || overId === "doing" || overId === "completed")
    ) {
      targetColumn = overId;
    } else {
      for (const status in columns) {
        if (columns[status as keyof typeof columns].some((task) => task._id === overId)) {
          targetColumn = status;
          break;
        }
      }
    }

    if (!targetColumn || sourceColumn === targetColumn) return;

    // Moving between columns
    setColumns((prev) => {
      const updated = { ...prev };

      // Find the task
      const taskIndex = updated[sourceColumn as keyof typeof updated].findIndex(
        (task) => task._id === activeId
      );

      if (taskIndex !== -1) {
        // Remove from source column
        const [task] = updated[sourceColumn as keyof typeof updated].splice(taskIndex, 1);

        // Add to target column at the end
        task.status = targetColumn as "todo" | "doing" | "completed";
        updated[targetColumn as keyof typeof updated].push(task);
      }

      return updated;
    });
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as Id<"tasks">;
    const overId = over.id;

    // Determine final position
    let finalStatus: "todo" | "doing" | "completed" | null = null;
    let newOrder = 0;

    // If over a column directly
    if (
      typeof overId === "string" &&
      (overId === "todo" || overId === "doing" || overId === "completed")
    ) {
      finalStatus = overId;
      // If dropping onto an empty column, set order to 0
      newOrder = columns[finalStatus].length;
    }
    // If over another task
    else {
      for (const status in columns) {
        const tasks = columns[status as keyof typeof columns];
        const overTaskIndex = tasks.findIndex((t) => t._id === overId);

        if (overTaskIndex !== -1) {
          finalStatus = status as "todo" | "doing" | "completed";
          newOrder = overTaskIndex;
          break;
        }
      }
    }

    if (!finalStatus) return;

    // Update the task status in the database
    await updateTaskStatus({
      taskId: activeId,
      status: finalStatus,
      order: newOrder,
    });

    // Reorder all tasks in the affected column
    const taskIds = columns[finalStatus].map((task) => task._id);

    await reorderTasks({
      projectId,
      status: finalStatus,
      taskIds,
    });

    // Reset active task
    setActiveTask(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}>
      <div className="flex gap-4 h-full justify-center">
        <SortableContext
          items={["todo", "doing", "completed"]}
          strategy={verticalListSortingStrategy}>
          <KanbanColumn
            id="todo"
            title="To Do"
            tasks={columns.todo}
            projectId={projectId}
          />
          <KanbanColumn
            id="doing"
            title="In Progress"
            tasks={columns.doing}
            projectId={projectId}
          />
          <KanbanColumn
            id="completed"
            title="Completed"
            tasks={columns.completed}
            projectId={projectId}
          />
        </SortableContext>
      </div>

      <DragOverlay>{activeTask ? <TaskCard task={activeTask} /> : null}</DragOverlay>
    </DndContext>
  );
}
