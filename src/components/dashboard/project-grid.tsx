"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useProjectsStore } from "@/stores/projects-store";
import { ProjectCard } from "./project-card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function ProjectGrid() {
  const router = useRouter();
  const { projects, loading, setProjects, setLoading, removeProject } =
    useProjectsStore();

  useEffect(() => {
    setLoading(true);
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data.projects || []))
      .catch(() => setProjects([]));
  }, [setProjects, setLoading]);

  const handleNewProject = useCallback(async () => {
    router.push("/workspace");
  }, [router]);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Delete this project?")) return;
      removeProject(id);
      await fetch(`/api/projects/${id}`, { method: "DELETE" }).catch(() => {});
    },
    [removeProject]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">
          No projects yet
        </h3>
        <p className="text-sm text-gray-500 mb-6 max-w-sm">
          Start by creating something in the workspace. Your projects will
          appear here.
        </p>
        <Button onClick={handleNewProject}>Go to Workspace</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Your Projects</h2>
        <Button size="sm" onClick={handleNewProject}>
          New Project
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
