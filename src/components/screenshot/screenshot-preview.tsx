"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { ScreenshotConfig } from "@/types/screenshot";
import { SCREENSHOT_SIZES } from "@/lib/screenshot-sizes";
import { compositeScreenshot, exportAllScreenshots } from "./screenshot-canvas";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface ScreenshotPreviewProps {
  config: ScreenshotConfig;
}

export function ScreenshotPreview({ config }: ScreenshotPreviewProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const mountedRef = useRef(true);

  // Generate previews
  useEffect(() => {
    mountedRef.current = true;
    setGenerating(true);

    async function generate() {
      const urls: string[] = [];
      for (let i = 0; i < config.appScreenshots.length; i++) {
        try {
          const blob = await compositeScreenshot(config, i);
          if (!mountedRef.current) return;
          urls.push(URL.createObjectURL(blob));
        } catch (err) {
          console.error(`Failed to composite screenshot ${i}:`, err);
        }
      }
      if (mountedRef.current) {
        setPreviews(urls);
        setGenerating(false);
      }
    }

    generate();

    return () => {
      mountedRef.current = false;
      // Clean up object URLs
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const handleExportAll = useCallback(async () => {
    setExporting(true);
    try {
      const blobs = await exportAllScreenshots(config);
      const size = SCREENSHOT_SIZES[config.device];

      for (let i = 0; i < blobs.length; i++) {
        const url = URL.createObjectURL(blobs[i]);
        const a = document.createElement("a");
        a.href = url;
        a.download = `screenshot-${config.device}-${i + 1}-${size.width}x${size.height}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        // Small delay between downloads
        await new Promise((r) => setTimeout(r, 200));
      }
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  }, [config]);

  const handleExportSingle = useCallback(
    async (index: number) => {
      try {
        const blob = await compositeScreenshot(config, index);
        const size = SCREENSHOT_SIZES[config.device];
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `screenshot-${config.device}-${index + 1}-${size.width}x${size.height}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Export failed:", err);
      }
    },
    [config]
  );

  const size = SCREENSHOT_SIZES[config.device];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Preview & Export
          </h2>
          <p className="text-sm text-gray-400">
            {config.appScreenshots.length} screenshot
            {config.appScreenshots.length !== 1 ? "s" : ""} at {size.width} ×{" "}
            {size.height}px ({size.label})
          </p>
        </div>
        <Button
          onClick={handleExportAll}
          disabled={exporting || generating || previews.length === 0}
        >
          {exporting ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Exporting...
            </>
          ) : (
            `Export All (${config.appScreenshots.length})`
          )}
        </Button>
      </div>

      {generating ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Spinner size="lg" />
          <p className="text-sm text-gray-400 mt-4">
            Generating previews...
          </p>
        </div>
      ) : (
        <>
          {/* Main preview */}
          {previews[activeIndex] && (
            <div className="relative mx-auto mb-6" style={{ maxWidth: 400 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previews[activeIndex]}
                alt={`Screenshot preview ${activeIndex + 1}`}
                className="w-full rounded-xl border border-white/10 shadow-2xl"
              />
              <button
                onClick={() => handleExportSingle(activeIndex)}
                className="absolute bottom-3 right-3 bg-white text-black text-xs px-3 py-1.5 rounded-md font-medium hover:bg-gray-200 transition-colors shadow"
              >
                Download
              </button>
            </div>
          )}

          {/* Thumbnail strip */}
          {previews.length > 1 && (
            <div className="flex gap-3 justify-center overflow-x-auto pb-2">
              {previews.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`shrink-0 w-16 rounded-lg overflow-hidden border-2 transition-all ${
                    i === activeIndex
                      ? "border-accent scale-105"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full aspect-[9/16] object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
