"use client";

import { useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";

interface ScreenshotUploadProps {
  screenshots: string[];
  onAdd: (url: string) => void;
  onRemove: (index: number) => void;
}

export function ScreenshotUpload({
  screenshots,
  onAdd,
  onRemove,
}: ScreenshotUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList) => {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;

        // Upload to fal.storage
        const formData = new FormData();
        formData.append("file", file);

        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          if (res.ok) {
            const data = await res.json();
            onAdd(data.falUrl);
          }
        } catch {
          // Create a local URL as fallback
          const url = URL.createObjectURL(file);
          onAdd(url);
        }
      }
    },
    [onAdd]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-2">
        Upload App Screenshots
      </h2>
      <p className="text-sm text-gray-400 mb-6">
        Upload your actual in-app screenshots. These will be placed inside the
        device frame.
      </p>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-white/20 transition-colors cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <svg
          className="w-10 h-10 text-gray-600 mx-auto mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="text-sm text-gray-400">
          Drop images here or click to browse
        </p>
        <p className="text-xs text-gray-600 mt-1">PNG, JPG, WebP</p>
      </div>

      {/* Uploaded screenshots */}
      {screenshots.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-300 mb-3">
            Uploaded ({screenshots.length})
          </h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {screenshots.map((url, i) => (
              <div key={i} className="relative group aspect-[9/16] rounded-lg overflow-hidden border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Screenshot ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(i);
                  }}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                >
                  ×
                </button>
                <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                  {i + 1}
                </div>
              </div>
            ))}
            {/* Add more button */}
            <button
              onClick={() => inputRef.current?.click()}
              className="aspect-[9/16] rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/20 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
