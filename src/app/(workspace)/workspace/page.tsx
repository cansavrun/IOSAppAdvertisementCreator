"use client";

import { useState } from "react";
import { ChatPanel } from "@/components/chat/chat-panel";
import { CanvasWorkspace } from "@/components/canvas/canvas-workspace";
import { ScreenshotEditor } from "@/components/screenshot/screenshot-editor";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { cn } from "@/lib/utils";

type RightPanel = "canvas" | "screenshots";
type MobileView = "chat" | "canvas";

export default function WorkspacePage() {
  const [rightPanel, setRightPanel] = useState<RightPanel>("canvas");
  const [mobileView, setMobileView] = useState<MobileView>("chat");

  return (
    <div className="flex h-full">
      {/* Mobile toggle - shown only on small screens */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex gap-1 p-1 bg-surface border border-white/10 rounded-xl shadow-xl">
        <button
          onClick={() => setMobileView("chat")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            mobileView === "chat"
              ? "bg-accent text-white"
              : "text-gray-400"
          )}
        >
          Chat
        </button>
        <button
          onClick={() => setMobileView("canvas")}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            mobileView === "canvas"
              ? "bg-accent text-white"
              : "text-gray-400"
          )}
        >
          Canvas
        </button>
      </div>

      {/* LEFT: Chat panel */}
      <div
        className={cn(
          "w-full md:w-[380px] md:min-w-[320px] shrink-0",
          mobileView !== "chat" && "hidden md:block"
        )}
      >
        <ErrorBoundary>
          <ChatPanel />
        </ErrorBoundary>
      </div>

      {/* RIGHT: Panel with tabs */}
      <div
        className={cn(
          "flex-1 flex flex-col bg-background",
          mobileView !== "canvas" && "hidden md:flex"
        )}
      >
        {/* Tab bar */}
        <div className="h-10 border-b border-white/10 flex items-center px-4 gap-1 shrink-0">
          <button
            onClick={() => setRightPanel("canvas")}
            className={cn(
              "px-3 py-1 rounded-md text-xs font-medium transition-colors",
              rightPanel === "canvas"
                ? "bg-white/10 text-white"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            )}
          >
            Canvas
          </button>
          <button
            onClick={() => setRightPanel("screenshots")}
            className={cn(
              "px-3 py-1 rounded-md text-xs font-medium transition-colors",
              rightPanel === "screenshots"
                ? "bg-white/10 text-white"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            )}
          >
            App Store Screenshots
          </button>
        </div>

        {/* Panel content */}
        <div className="flex-1 overflow-hidden">
          <ErrorBoundary>
            {rightPanel === "canvas" ? (
              <CanvasWorkspace />
            ) : (
              <ScreenshotEditor />
            )}
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
