"use client";

import Link from "next/link";
import type { Project } from "@/types/database";
import { formatDate } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  return (
    <Link
      href={`/project/${project.id}`}
      className="group block rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all overflow-hidden"
    >
      {/* Thumbnail placeholder */}
      <div className="aspect-video bg-gradient-to-br from-accent/20 to-purple-500/20 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-white/20"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-white truncate">
              {project.title}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {formatDate(project.created_at)}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(project.id);
            }}
            className="p-1 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded"
            title="Delete project"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
}
