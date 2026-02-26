"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { MediaItem } from "@/types/database";
import { useCanvasStore } from "@/stores/canvas-store";
import { Spinner } from "@/components/ui/spinner";

interface MediaCardProps {
  item: MediaItem;
  isSelected: boolean;
  onSelect: () => void;
}

function retryGeneration(item: MediaItem) {
  const canvasStore = useCanvasStore.getState();

  // Reset the item to generating state
  canvasStore.updateItem(item.id, {
    status: "generating",
    error_message: null,
    result_url: null,
    output: null,
    completed_at: null,
  });

  // Determine the correct endpoint and body from the original input
  const input = item.input as Record<string, unknown>;
  let endpoint: string;
  let body: Record<string, unknown>;

  if (item.parent_id) {
    // This was an edit operation
    const sourceItem = canvasStore.items.find((i) => i.id === item.parent_id);
    const sourceUrl = sourceItem?.result_url || input.source_url;

    if (item.fal_model.includes("remove") || item.fal_model.includes("bria")) {
      endpoint = "/api/tools/remove-bg";
      body = { source_url: sourceUrl };
    } else if (item.fal_model.includes("upscal") || item.fal_model.includes("clarity")) {
      endpoint = "/api/tools/upscale";
      body = { source_url: sourceUrl, scale_factor: input.scale_factor || 2 };
    } else if (item.type === "video") {
      endpoint = "/api/edit/video";
      body = { ...input, source_url: sourceUrl };
    } else {
      endpoint = "/api/edit/image";
      body = { ...input, source_url: sourceUrl };
    }
  } else if (item.type === "video") {
    endpoint = "/api/generate/video";
    body = {
      prompt: item.prompt,
      model: item.fal_model,
      duration: input.duration || "5",
      aspect_ratio: input.aspect_ratio || "9:16",
      image_url: input.image_url,
    };
  } else {
    endpoint = "/api/generate/image";
    body = {
      prompt: item.prompt,
      model: item.fal_model,
      aspect_ratio: input.aspect_ratio || "1:1",
    };
  }

  // Fire the request
  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          (err as { error?: string }).error || `HTTP ${res.status}`
        );
      }
      return res.json();
    })
    .then((data) => {
      canvasStore.updateItem(item.id, {
        status: "completed",
        result_url: data.resultUrl,
        fal_request_id: data.requestId,
        output: data.output,
        completed_at: new Date().toISOString(),
      });
    })
    .catch((error) => {
      canvasStore.updateItem(item.id, {
        status: "failed",
        error_message:
          error instanceof Error ? error.message : "Generation failed",
      });
    });
}

function deleteItem(id: string, e: React.MouseEvent) {
  e.stopPropagation();
  useCanvasStore.getState().removeItem(id);
}

export function MediaCard({ item, isSelected, onSelect }: MediaCardProps) {
  const isLoading = item.status === "queued" || item.status === "generating";
  const isFailed = item.status === "failed";
  const [elapsed, setElapsed] = useState(0);

  // Timer for loading states
  useEffect(() => {
    if (!isLoading) {
      setElapsed(0);
      return;
    }
    const start = Date.now();
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [isLoading]);

  return (
    <div
      onClick={onSelect}
      className={cn(
        "group relative rounded-xl border overflow-hidden cursor-pointer transition-all",
        isSelected
          ? "border-accent ring-2 ring-accent/30"
          : "border-white/10 hover:border-white/20",
        isFailed && "border-red-500/30"
      )}
    >
      {/* Media preview */}
      <div className="aspect-square bg-white/5 relative">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <Spinner size="lg" />
            <span className="text-xs text-white font-medium">
              Generating {item.type}...
            </span>
            <span className="text-xs text-gray-500">
              {elapsed > 0
                ? `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, "0")}`
                : "Starting..."}
            </span>
            {item.type === "video" && elapsed > 5 && (
              <span className="text-[10px] text-gray-600 px-3 text-center">
                Videos take 1-4 min
              </span>
            )}
            <div className="absolute inset-0 bg-accent/5 animate-pulse-slow" />
          </div>
        ) : isFailed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.07 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <span className="text-xs text-red-400">Generation failed</span>
            {item.error_message && (
              <span className="text-xs text-gray-500 text-center line-clamp-2">
                {item.error_message}
              </span>
            )}
            <div className="flex gap-2 mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  retryGeneration(item);
                }}
                className="text-xs bg-accent text-white px-3 py-1.5 rounded-md font-medium hover:bg-accent-hover transition-colors"
              >
                Retry
              </button>
              <button
                onClick={(e) => deleteItem(item.id, e)}
                className="text-xs bg-white/10 text-gray-300 px-3 py-1.5 rounded-md hover:bg-white/20 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ) : item.result_url ? (
          item.type === "video" ? (
            <video
              src={item.result_url}
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
              onMouseEnter={(e) => e.currentTarget.play()}
              onMouseLeave={(e) => {
                e.currentTarget.pause();
                e.currentTarget.currentTime = 0;
              }}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.result_url}
              alt={item.prompt || "Generated media"}
              className="w-full h-full object-cover"
            />
          )
        ) : null}

        {/* Type badge */}
        <div className="absolute top-2 left-2">
          <span
            className={cn(
              "text-xs px-2 py-0.5 rounded-full font-medium",
              item.type === "video"
                ? "bg-purple-500/20 text-purple-300"
                : item.type === "screenshot"
                  ? "bg-blue-500/20 text-blue-300"
                  : "bg-green-500/20 text-green-300"
            )}
          >
            {item.type}
          </span>
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
            <svg
              className="w-3.5 h-3.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}

        {/* Delete button (top right, non-selected) */}
        {!isSelected && !isLoading && (
          <button
            onClick={(e) => deleteItem(item.id, e)}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-gray-400 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
            title="Remove"
          >
            ×
          </button>
        )}

        {/* Hover overlay for completed items */}
        {item.status === "completed" && item.result_url && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
            <div className="flex gap-2 w-full">
              <a
                href={item.result_url}
                download={`reels-creator-${item.id.slice(0, 8)}.${item.type === "video" ? "mp4" : "png"}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-1 text-xs bg-white text-black rounded-md py-1.5 font-medium hover:bg-gray-200 transition-colors text-center"
              >
                Download
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-xs text-gray-400 truncate">
          {item.prompt || "No prompt"}
        </p>
      </div>
    </div>
  );
}
