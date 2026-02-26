"use client";

import { cn } from "@/lib/utils";
import { SCREENSHOT_SIZES } from "@/lib/screenshot-sizes";

interface DeviceFramePickerProps {
  selected: string;
  onSelect: (device: string) => void;
}

const DEVICE_INFO: Record<string, { icon: string; required: boolean }> = {
  "iphone-6.9": { icon: "📱", required: true },
  "iphone-6.7": { icon: "📱", required: false },
  "iphone-6.1": { icon: "📱", required: false },
  "ipad-13": { icon: "📋", required: false },
};

export function DeviceFramePicker({
  selected,
  onSelect,
}: DeviceFramePickerProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-2">
        Choose Device Frame
      </h2>
      <p className="text-sm text-gray-400 mb-6">
        Select the device size for your App Store screenshots. iPhone 6.9&quot;
        is required by Apple.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(SCREENSHOT_SIZES).map(([key, size]) => {
          const info = DEVICE_INFO[key];
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={cn(
                "p-4 rounded-xl border text-left transition-all",
                selected === key
                  ? "border-accent bg-accent/10 ring-2 ring-accent/30"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              )}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{info?.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">
                      {size.label}
                    </span>
                    {info?.required && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium">
                        Required
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {size.width} × {size.height}px
                  </span>
                </div>
                {selected === key && (
                  <svg
                    className="w-5 h-5 text-accent shrink-0"
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
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
