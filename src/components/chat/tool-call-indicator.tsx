"use client";

import type { ToolCallUI } from "@/types/chat";

interface ToolCallIndicatorProps {
  toolCall: ToolCallUI;
}

const TOOL_LABELS: Record<string, string> = {
  generate_image: "Generating image",
  generate_video: "Generating video",
  edit_image: "Editing image",
  remove_background: "Removing background",
  upscale_image: "Upscaling image",
  style_transfer: "Applying style",
  outpaint_image: "Extending image",
  restyle_video: "Restyling video",
  edit_video: "Editing video",
  extend_video: "Extending video",
  select_media: "Selecting item",
};

export function ToolCallIndicator({ toolCall }: ToolCallIndicatorProps) {
  const label = TOOL_LABELS[toolCall.name] || toolCall.name;

  return (
    <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 rounded-lg px-3 py-2 border border-white/5">
      {toolCall.status === "running" ? (
        <div className="w-3.5 h-3.5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      ) : toolCall.status === "completed" ? (
        <svg
          className="w-3.5 h-3.5 text-green-400"
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
      ) : toolCall.status === "failed" ? (
        <svg
          className="w-3.5 h-3.5 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ) : (
        <div className="w-3.5 h-3.5 rounded-full bg-gray-500/30" />
      )}
      <span>{label}</span>
    </div>
  );
}
