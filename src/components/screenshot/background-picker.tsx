"use client";

import { cn } from "@/lib/utils";

interface BackgroundPickerProps {
  type: "gradient" | "solid" | "ai";
  value: string;
  onTypeChange: (type: "gradient" | "solid" | "ai") => void;
  onValueChange: (value: string) => void;
}

const PRESET_GRADIENTS = [
  { label: "Indigo → Purple", value: "#6366f1,#8b5cf6" },
  { label: "Blue → Cyan", value: "#3b82f6,#06b6d4" },
  { label: "Rose → Orange", value: "#f43f5e,#f97316" },
  { label: "Green → Teal", value: "#22c55e,#14b8a6" },
  { label: "Midnight", value: "#1e1b4b,#312e81" },
  { label: "Sunset", value: "#f97316,#ec4899" },
  { label: "Ocean", value: "#0ea5e9,#6366f1" },
  { label: "Forest", value: "#065f46,#059669" },
];

const PRESET_SOLIDS = [
  "#000000",
  "#1a1a2e",
  "#16213e",
  "#0f3460",
  "#ffffff",
  "#f8fafc",
  "#6366f1",
  "#8b5cf6",
];

export function BackgroundPicker({
  type,
  value,
  onTypeChange,
  onValueChange,
}: BackgroundPickerProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-2">Background</h2>
      <p className="text-sm text-gray-400 mb-4">
        Choose a background for your App Store screenshots
      </p>

      {/* Type tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-white/5 rounded-lg w-fit">
        {(["gradient", "solid", "ai"] as const).map((t) => (
          <button
            key={t}
            onClick={() => onTypeChange(t)}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm capitalize transition-colors",
              type === t
                ? "bg-white/10 text-white"
                : "text-gray-400 hover:text-white"
            )}
          >
            {t === "ai" ? "AI Generated" : t}
          </button>
        ))}
      </div>

      {/* Gradient picker */}
      {type === "gradient" && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            {PRESET_GRADIENTS.map((g) => {
              const [from, to] = g.value.split(",");
              return (
                <button
                  key={g.value}
                  onClick={() => onValueChange(g.value)}
                  className={cn(
                    "aspect-video rounded-lg border-2 transition-all",
                    value === g.value
                      ? "border-white scale-105"
                      : "border-transparent hover:border-white/30"
                  )}
                  style={{
                    background: `linear-gradient(135deg, ${from}, ${to})`,
                  }}
                  title={g.label}
                />
              );
            })}
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-500">Custom:</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={value.split(",")[0] || "#6366f1"}
                onChange={(e) => {
                  const parts = value.split(",");
                  onValueChange(`${e.target.value},${parts[1] || "#8b5cf6"}`);
                }}
                className="w-8 h-8 rounded cursor-pointer bg-transparent"
              />
              <span className="text-gray-600">→</span>
              <input
                type="color"
                value={value.split(",")[1] || "#8b5cf6"}
                onChange={(e) => {
                  const parts = value.split(",");
                  onValueChange(`${parts[0] || "#6366f1"},${e.target.value}`);
                }}
                className="w-8 h-8 rounded cursor-pointer bg-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Solid picker */}
      {type === "solid" && (
        <div className="space-y-4">
          <div className="grid grid-cols-8 gap-3">
            {PRESET_SOLIDS.map((color) => (
              <button
                key={color}
                onClick={() => onValueChange(color)}
                className={cn(
                  "aspect-square rounded-lg border-2 transition-all",
                  value === color
                    ? "border-white scale-110"
                    : "border-transparent hover:border-white/30"
                )}
                style={{ background: color }}
              />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-500">Custom:</label>
            <input
              type="color"
              value={value || "#000000"}
              onChange={(e) => onValueChange(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer bg-transparent"
            />
            <span className="text-xs text-gray-400">{value}</span>
          </div>
        </div>
      )}

      {/* AI background */}
      {type === "ai" && (
        <div className="border border-dashed border-white/10 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-400 mb-3">
            Describe the background you want and AI will generate it
          </p>
          <input
            type="text"
            placeholder="e.g. abstract gradient with soft purple and blue waves"
            className="w-full h-10 rounded-lg border border-white/20 bg-white/5 px-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/30 mb-3"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                // Will trigger AI background generation via chat
                onValueChange((e.target as HTMLInputElement).value);
              }
            }}
          />
          <p className="text-xs text-gray-600">
            Press Enter to generate. Uses your fal.ai credits.
          </p>
        </div>
      )}

      {/* Preview */}
      <div className="mt-6">
        <label className="text-xs text-gray-500 mb-2 block">Preview</label>
        <div
          className="aspect-video rounded-lg border border-white/10"
          style={
            type === "gradient"
              ? {
                  background: `linear-gradient(135deg, ${value.split(",")[0]}, ${value.split(",")[1]})`,
                }
              : type === "solid"
                ? { background: value }
                : { background: "#1a1a2e" }
          }
        />
      </div>
    </div>
  );
}
