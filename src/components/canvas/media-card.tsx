"use client";

import { cn } from "@/lib/utils";
import type { MediaItem } from "@/types/database";
import { Spinner } from "@/components/ui/spinner";

interface MediaCardProps {
  item: MediaItem;
  isSelected: boolean;
  onSelect: () => void;
}

export function MediaCard({ item, isSelected, onSelect }: MediaCardProps) {
  const isLoading = item.status === "queued" || item.status === "generating";
  const isFailed = item.status === "failed";

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
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Spinner size="lg" />
            <span className="text-xs text-gray-400">
              {item.status === "queued" ? "In queue..." : "Generating..."}
            </span>
            {/* Pulsing background */}
            <div className="absolute inset-0 bg-accent/5 animate-pulse-slow" />
          </div>
        ) : isFailed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
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
              <span className="text-xs text-gray-500 px-2 text-center">
                {item.error_message}
              </span>
            )}
          </div>
        ) : item.result_url ? (
          item.type === "video" ? (
            <video
              src={item.result_url}
              className="w-full h-full object-cover"
              muted
              loop
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

        {/* Hover overlay */}
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
