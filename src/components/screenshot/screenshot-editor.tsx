"use client";

import { useState, useCallback } from "react";
import type { ScreenshotConfig, TextOverlay } from "@/types/screenshot";
import { SCREENSHOT_SIZES } from "@/lib/screenshot-sizes";
import { DeviceFramePicker } from "./device-frame-picker";
import { ScreenshotUpload } from "./screenshot-upload";
import { TextOverlayEditor } from "./text-overlay-editor";
import { BackgroundPicker } from "./background-picker";
import { ScreenshotPreview } from "./screenshot-preview";
import { Button } from "@/components/ui/button";

const STEPS = [
  "Upload Screenshots",
  "Device Frame",
  "Text & Background",
  "Preview & Export",
] as const;

export function ScreenshotEditor() {
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState<ScreenshotConfig>({
    device: "iphone-6.9",
    appScreenshots: [],
    backgroundType: "gradient",
    backgroundValue: "#6366f1,#8b5cf6",
    textOverlays: [],
  });

  const updateConfig = useCallback(
    (update: Partial<ScreenshotConfig>) => {
      setConfig((prev) => ({ ...prev, ...update }));
    },
    []
  );

  const addTextOverlay = useCallback(() => {
    const overlay: TextOverlay = {
      id: crypto.randomUUID(),
      text: "Your App Name",
      fontSize: 64,
      fontWeight: "700",
      color: "#ffffff",
      position: "above",
      y: 200,
    };
    setConfig((prev) => ({
      ...prev,
      textOverlays: [...prev.textOverlays, overlay],
    }));
  }, []);

  const updateTextOverlay = useCallback(
    (id: string, update: Partial<TextOverlay>) => {
      setConfig((prev) => ({
        ...prev,
        textOverlays: prev.textOverlays.map((t) =>
          t.id === id ? { ...t, ...update } : t
        ),
      }));
    },
    []
  );

  const removeTextOverlay = useCallback((id: string) => {
    setConfig((prev) => ({
      ...prev,
      textOverlays: prev.textOverlays.filter((t) => t.id !== id),
    }));
  }, []);

  const canProceed = () => {
    if (step === 0) return config.appScreenshots.length > 0;
    return true;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Step indicator */}
      <div className="border-b border-white/10 px-6 py-3 flex items-center gap-2 shrink-0">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <button
              onClick={() => i <= step && setStep(i)}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                i === step
                  ? "bg-accent text-white"
                  : i < step
                    ? "bg-white/10 text-white cursor-pointer"
                    : "bg-white/5 text-gray-500"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px]">
                {i < step ? "✓" : i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div className="w-8 h-px bg-white/10" />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto p-6">
        {step === 0 && (
          <ScreenshotUpload
            screenshots={config.appScreenshots}
            onAdd={(url) =>
              updateConfig({
                appScreenshots: [...config.appScreenshots, url],
              })
            }
            onRemove={(index) =>
              updateConfig({
                appScreenshots: config.appScreenshots.filter(
                  (_, i) => i !== index
                ),
              })
            }
          />
        )}

        {step === 1 && (
          <DeviceFramePicker
            selected={config.device}
            onSelect={(device) => updateConfig({ device })}
          />
        )}

        {step === 2 && (
          <div className="space-y-8">
            <TextOverlayEditor
              overlays={config.textOverlays}
              onAdd={addTextOverlay}
              onUpdate={updateTextOverlay}
              onRemove={removeTextOverlay}
            />
            <BackgroundPicker
              type={config.backgroundType}
              value={config.backgroundValue}
              onTypeChange={(backgroundType) => updateConfig({ backgroundType })}
              onValueChange={(backgroundValue) =>
                updateConfig({ backgroundValue })
              }
            />
          </div>
        )}

        {step === 3 && (
          <ScreenshotPreview config={config} />
        )}
      </div>

      {/* Navigation */}
      <div className="border-t border-white/10 px-6 py-3 flex items-center justify-between shrink-0">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
        >
          Back
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {config.appScreenshots.length} screenshot
            {config.appScreenshots.length !== 1 ? "s" : ""} ·{" "}
            {SCREENSHOT_SIZES[config.device]?.label}
          </span>
        </div>
        {step < STEPS.length - 1 ? (
          <Button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed()}
          >
            Next
          </Button>
        ) : (
          <Button onClick={() => {/* export handled in ScreenshotPreview */}}>
            Done
          </Button>
        )}
      </div>
    </div>
  );
}
