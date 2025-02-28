"use client";

import { useQuery } from "convex/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useId, useState } from "react";
import Link from "next/link";
import { api } from "../../../convex/_generated/api";
import { CreateProjectModal } from "@/_components/modals/create-new-project";
import { useAuth, useOrganization, useUser } from "@clerk/nextjs";

export default function DashboardPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const identity = useAuth();
  const organization = useOrganization();
  const user = useUser();

  // Determine the organization ID or fall back to user ID
  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  // Query projects with the parameters
  const projects = useQuery(
    api.projects.getProjects,
    orgId
      ? {
          orgId,
        }
      : "skip"
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Projects</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {projects?.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
            <p className="text-gray-500 text-center">You haven&apos;t created any projects yet.</p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects?.map((project) => (
            <Link
              key={project._id}
              href={`/dashboard/${project._id}`}
              passHref>
              <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {project.description && (
                    <p className="text-gray-600 text-sm">{project.description}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-4">
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <CreateProjectModal
        orgId={orgId}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
