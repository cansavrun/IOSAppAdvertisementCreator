import { useJobStore, type Job } from "@/stores/job-store";
import { useCanvasStore } from "@/stores/canvas-store";

const POLL_INTERVAL = 3000; // 3 seconds
const MAX_POLL_TIME = 10 * 60 * 1000; // 10 minutes max

/**
 * Starts polling for a generation job's status.
 * Updates both the job store and the canvas store when status changes.
 */
export function startPolling(job: Job): void {
  const jobStore = useJobStore.getState();
  const startTime = Date.now();

  const interval = setInterval(async () => {
    // Safety: stop polling after max time
    if (Date.now() - startTime > MAX_POLL_TIME) {
      stopPolling(job.id, "Generation timed out");
      return;
    }

    try {
      const res = await fetch(
        `/api/generation/${job.falRequestId}?model=${encodeURIComponent(job.falModel)}`
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        stopPolling(
          job.id,
          (errorData as { error?: string }).error || `HTTP ${res.status}`
        );
        return;
      }

      const data = await res.json();

      if (data.status === "completed") {
        // Update job store
        useJobStore.getState().updateJob(job.id, {
          status: "completed",
          progress: 100,
        });

        // Update canvas with result
        useCanvasStore.getState().updateItem(job.mediaItemId, {
          status: "completed",
          result_url: data.resultUrl,
          output: data.output,
          completed_at: new Date().toISOString(),
        });

        // Stop polling
        useJobStore.getState().clearPollingInterval(job.id);
      } else if (data.status === "generating") {
        useJobStore.getState().updateJob(job.id, {
          status: "generating",
          progress: Math.min(
            90,
            Math.round(((Date.now() - startTime) / 60000) * 100)
          ),
        });
        useCanvasStore.getState().updateItem(job.mediaItemId, {
          status: "generating",
        });
      }
      // If queued, just keep polling
    } catch (error) {
      console.error(`Poll error for job ${job.id}:`, error);
      // Don't stop polling on network errors, just retry
    }
  }, POLL_INTERVAL);

  jobStore.setPollingInterval(job.id, interval);
}

function stopPolling(jobId: string, errorMessage: string): void {
  const jobStore = useJobStore.getState();
  const job = jobStore.jobs.get(jobId);

  jobStore.updateJob(jobId, {
    status: "failed",
    error: errorMessage,
  });
  jobStore.clearPollingInterval(jobId);

  if (job) {
    useCanvasStore.getState().updateItem(job.mediaItemId, {
      status: "failed",
      error_message: errorMessage,
    });
  }
}
