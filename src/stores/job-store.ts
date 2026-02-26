import { create } from "zustand";

export interface Job {
  id: string;
  mediaItemId: string;
  falRequestId: string;
  falModel: string;
  status: "queued" | "generating" | "completed" | "failed";
  progress: number;
  startedAt: number;
  error?: string;
}

interface JobState {
  jobs: Map<string, Job>;
  pollingIntervals: Map<string, NodeJS.Timeout>;

  addJob: (job: Job) => void;
  updateJob: (id: string, update: Partial<Job>) => void;
  removeJob: (id: string) => void;
  getActiveJobs: () => Job[];
  setPollingInterval: (id: string, interval: NodeJS.Timeout) => void;
  clearPollingInterval: (id: string) => void;
  clearAllPolling: () => void;
}

export const useJobStore = create<JobState>((set, get) => ({
  jobs: new Map(),
  pollingIntervals: new Map(),

  addJob: (job) =>
    set((state) => {
      const jobs = new Map(state.jobs);
      jobs.set(job.id, job);
      return { jobs };
    }),

  updateJob: (id, update) =>
    set((state) => {
      const jobs = new Map(state.jobs);
      const existing = jobs.get(id);
      if (existing) {
        jobs.set(id, { ...existing, ...update });
      }
      return { jobs };
    }),

  removeJob: (id) =>
    set((state) => {
      const jobs = new Map(state.jobs);
      jobs.delete(id);
      // Clean up polling
      const pollingIntervals = new Map(state.pollingIntervals);
      const interval = pollingIntervals.get(id);
      if (interval) {
        clearInterval(interval);
        pollingIntervals.delete(id);
      }
      return { jobs, pollingIntervals };
    }),

  getActiveJobs: () => {
    const { jobs } = get();
    return Array.from(jobs.values()).filter(
      (j) => j.status === "queued" || j.status === "generating"
    );
  },

  setPollingInterval: (id, interval) =>
    set((state) => {
      const pollingIntervals = new Map(state.pollingIntervals);
      pollingIntervals.set(id, interval);
      return { pollingIntervals };
    }),

  clearPollingInterval: (id) =>
    set((state) => {
      const pollingIntervals = new Map(state.pollingIntervals);
      const interval = pollingIntervals.get(id);
      if (interval) {
        clearInterval(interval);
        pollingIntervals.delete(id);
      }
      return { pollingIntervals };
    }),

  clearAllPolling: () =>
    set((state) => {
      state.pollingIntervals.forEach((interval) => clearInterval(interval));
      return { pollingIntervals: new Map() };
    }),
}));
