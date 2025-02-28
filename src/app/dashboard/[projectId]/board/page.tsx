"use client";

import { useParams } from "next/navigation";
import { Id } from "../../../../../convex/_generated/dataModel";
import { KanbanBoard } from "@/_components/kanban/board";

export default function BoardPage() {
  const params = useParams();
  const projectId = params.projectId as Id<"projects">;

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <KanbanBoard projectId={projectId} />
      </div>
    </div>
  );
}
