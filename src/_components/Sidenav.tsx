"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../components/ui/sidebar";
import { IconLayout, IconLayoutDashboard, IconPlus, IconFolder } from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { OrganizationSwitcher, UserButton, useAuth, useOrganization, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { CreateProjectModal } from "./modals/create-new-project";
import { api } from "../../convex/_generated/api";
import { FilesIcon } from "lucide-react";

export function SideNav() {
  const pathname = usePathname();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Get the current organization and user from Clerk
  const organization = useOrganization();
  const user = useUser();

  // Set orgId to organization ID if available, otherwise fall back to user ID
  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  // Fetch projects from Convex using the organization ID or user ID as fallback
  const projects = useQuery(api.projects.getProjects, orgId ? { orgId } : "skip");

  return (
    <div className="flex flex-col bg-gray-50 dark:bg-neutral-800 h-screen border-r border-neutral-200 dark:border-neutral-700">
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        orgId={orgId}
      />

      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        animate={true}>
        <SidebarBody className="flex flex-col h-full">
          {/* Logo Section */}
          <div className={cn("py-4", sidebarOpen ? "px-4" : "px-0 flex justify-center")}>
            {sidebarOpen ? <Logo /> : <LogoIcon />}
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/* Projects Section */}
            <div className={cn("mt-2 mb-4", sidebarOpen ? "px-4" : "px-0")}>
              {/* Projects Header */}
              <div
                className={cn(
                  "flex items-center mb-2",
                  sidebarOpen ? "justify-between px-0" : "justify-center"
                )}>
                {sidebarOpen && (
                  <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    PROJECTS
                  </h3>
                )}
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className={cn(
                    "p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors",
                    !sidebarOpen && "mx-auto"
                  )}
                  aria-label="Add new project">
                  <IconPlus className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                </button>
              </div>

              {/* Projects List */}
              <div className={cn("flex flex-col gap-1", !sidebarOpen && "items-center")}>
                <SidebarLink
                  active={pathname === "/dashboard"}
                  link={{
                    label: "Dashboard",
                    href: "/dashboard",
                    icon: (
                      <IconLayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                    ),
                  }}
                />

                {projects?.map((project) => (
                  <SidebarLink
                    key={project._id}
                    active={pathname.includes(`/dashboard/${project._id}`)}
                    link={{
                      label: project.name,
                      href: `/dashboard/${project._id}`,
                      icon: (
                        <IconFolder className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                      ),
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* User Button */}
          <div
            className={cn(
              "border-t border-neutral-200 dark:border-neutral-700",
              sidebarOpen ? "p-4" : "py-4 flex justify-center"
            )}>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonTrigger: "dark:text-white",
                },
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}

// Logo components
export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <FilesIcon />

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre">
        Your Projects
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="flex justify-center items-center text-sm text-black py-1 relative z-20">
      <FilesIcon />
      {/* <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" /> */}
    </Link>
  );
};
