import { create } from "zustand";
import type { Project } from "@/types/database";

interface ProjectsState {
  projects: Project[];
  currentProjectId: string | null;
  loading: boolean;

  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, update: Partial<Project>) => void;
  removeProject: (id: string) => void;
  setCurrentProjectId: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useProjectsStore = create<ProjectsState>((set) => ({
  projects: [],
  currentProjectId: null,
  loading: false,

  setProjects: (projects) => set({ projects, loading: false }),

  addProject: (project) =>
    set((state) => ({ projects: [project, ...state.projects] })),

  updateProject: (id, update) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...update } : p
      ),
    })),

  removeProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      currentProjectId:
        state.currentProjectId === id ? null : state.currentProjectId,
    })),

  setCurrentProjectId: (id) => set({ currentProjectId: id }),

  setLoading: (loading) => set({ loading }),
}));
