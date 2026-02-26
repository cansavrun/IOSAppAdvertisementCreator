"use client";

import type { TextOverlay } from "@/types/screenshot";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TextOverlayEditorProps {
  overlays: TextOverlay[];
  onAdd: () => void;
  onUpdate: (id: string, update: Partial<TextOverlay>) => void;
  onRemove: (id: string) => void;
}

export function TextOverlayEditor({
  overlays,
  onAdd,
  onUpdate,
  onRemove,
}: TextOverlayEditorProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Text Overlays</h2>
          <p className="text-sm text-gray-400">
            Add marketing text above or below the device frame
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={onAdd}>
          Add Text
        </Button>
      </div>

      {overlays.length === 0 ? (
        <div className="border border-dashed border-white/10 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-500">
            No text overlays yet. Click &quot;Add Text&quot; to add a headline.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {overlays.map((overlay) => (
            <div
              key={overlay.id}
              className="border border-white/10 rounded-xl p-4 bg-white/5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium uppercase">
                  Text Overlay
                </span>
                <button
                  onClick={() => onRemove(overlay.id)}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Remove
                </button>
              </div>

              {/* Text content */}
              <Input
                value={overlay.text}
                onChange={(e) =>
                  onUpdate(overlay.id, { text: e.target.value })
                }
                placeholder="Enter headline text..."
              />

              <div className="grid grid-cols-3 gap-3">
                {/* Font size */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Size
                  </label>
                  <select
                    value={overlay.fontSize}
                    onChange={(e) =>
                      onUpdate(overlay.id, {
                        fontSize: Number(e.target.value),
                      })
                    }
                    className="w-full h-10 rounded-lg border border-white/20 bg-white/5 px-3 text-sm text-white"
                  >
                    <option value={32}>Small (32)</option>
                    <option value={48}>Medium (48)</option>
                    <option value={64}>Large (64)</option>
                    <option value={80}>XL (80)</option>
                    <option value={96}>XXL (96)</option>
                  </select>
                </div>

                {/* Font weight */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Weight
                  </label>
                  <select
                    value={overlay.fontWeight}
                    onChange={(e) =>
                      onUpdate(overlay.id, { fontWeight: e.target.value })
                    }
                    className="w-full h-10 rounded-lg border border-white/20 bg-white/5 px-3 text-sm text-white"
                  >
                    <option value="400">Regular</option>
                    <option value="600">Semibold</option>
                    <option value="700">Bold</option>
                    <option value="800">Extra Bold</option>
                  </select>
                </div>

                {/* Position */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Position
                  </label>
                  <select
                    value={overlay.position}
                    onChange={(e) =>
                      onUpdate(overlay.id, {
                        position: e.target.value as "above" | "below",
                      })
                    }
                    className="w-full h-10 rounded-lg border border-white/20 bg-white/5 px-3 text-sm text-white"
                  >
                    <option value="above">Above device</option>
                    <option value="below">Below device</option>
                  </select>
                </div>
              </div>

              {/* Color */}
              <div className="flex items-center gap-3">
                <label className="text-xs text-gray-500">Color</label>
                <input
                  type="color"
                  value={overlay.color}
                  onChange={(e) =>
                    onUpdate(overlay.id, { color: e.target.value })
                  }
                  className="w-8 h-8 rounded cursor-pointer bg-transparent"
                />
                <span className="text-xs text-gray-400">{overlay.color}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
