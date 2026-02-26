"use client";

import { useCanvasStore } from "@/stores/canvas-store";
import { useJobStore } from "@/stores/job-store";
import { MediaCard } from "./media-card";
import { EmptyCanvas } from "./empty-canvas";

export function CanvasWorkspace() {
  const { items, selectedItemId, selectItem } = useCanvasStore();
  const { jobs } = useJobStore();

  const activeJobs = Array.from(jobs.values()).filter(
    (j) => j.status === "queued" || j.status === "generating"
  );

  if (items.length === 0) {
    return <EmptyCanvas />;
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Active jobs bar */}
      {activeJobs.length > 0 && (
        <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/10 border border-accent/20">
          <div className="w-3 h-3 border-2 border-accent/40 border-t-accent rounded-full animate-spin" />
          <span className="text-xs text-accent">
            {activeJobs.length} generation{activeJobs.length !== 1 ? "s" : ""}{" "}
            in progress
          </span>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-medium text-gray-400">
            {items.length} item{items.length !== 1 ? "s" : ""}
          </h2>
          {selectedItemId && (
            <>
              <div className="w-px h-4 bg-white/10" />
              <span className="text-xs text-accent">1 selected</span>
              <button
                onClick={() => selectItem(null)}
                className="text-xs text-gray-500 hover:text-white transition-colors"
              >
                Clear
              </button>
            </>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <MediaCard
            key={item.id}
            item={item}
            isSelected={item.id === selectedItemId}
            onSelect={() =>
              selectItem(item.id === selectedItemId ? null : item.id)
            }
          />
        ))}
      </div>
    </div>
  );
}
