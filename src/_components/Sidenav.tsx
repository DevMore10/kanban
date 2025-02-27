"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconPlus,
  IconFolder,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function SideNav() {
  const navigationLinks = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  // Project state with initial sample projects
  const [projects, setProjects] = useState([
    { id: 1, title: "Website Redesign" },
    { id: 2, title: "Mobile App" },
    { id: 3, title: "Marketing Campaign" },
  ]);

  // Function to add a new project
  const addProject = () => {
    const newId = projects.length > 0 ? Math.max(...projects.map((project) => project.id)) + 1 : 1;
    const newProject = { id: newId, title: `Project ${newId}` };
    setProjects([...projects, newProject]);
  };

  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-7xl mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}>
      <Sidebar
        open={open}
        setOpen={setOpen}
        animate={false}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <>
              <Logo />
            </>

            {/* Projects Section */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-2 px-3">
                <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Projects
                </h3>
                <button
                  onClick={addProject}
                  className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  aria-label="Add new project">
                  <IconPlus className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                </button>
              </div>

              <div className="flex flex-col gap-1">
                {projects.map((project) => (
                  <SidebarLink
                    key={project.id}
                    link={{
                      label: project.title,
                      href: `#project-${project.id}`,
                      icon: (
                        <IconFolder className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                      ),
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Navigation Links */}
            <div className="mt-8 pt-4 border-t border-neutral-200 dark:border-neutral-700 flex flex-col gap-2">
              {navigationLinks.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Manu Arora",
                href: "#",
                icon: (
                  <Image
                    src="/logo.svg"
                    className="h-7 w-7 flex-shrink-0"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
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
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
