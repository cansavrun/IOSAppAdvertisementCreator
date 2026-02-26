"use client";

import { cn } from "@/lib/utils";
import type { ChatMessageUI } from "@/types/chat";
import { ToolCallIndicator } from "./tool-call-indicator";

interface ChatMessageBubbleProps {
  message: ChatMessageUI;
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 mt-0.5",
          isUser ? "bg-accent/30 text-accent" : "bg-white/10 text-white"
        )}
      >
        {isUser ? "U" : "AI"}
      </div>

      {/* Message */}
      <div className={cn("max-w-[85%] space-y-2")}>
        {/* Text content */}
        {message.content && (
          <div
            className={cn(
              "rounded-xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
              isUser
                ? "bg-accent text-white"
                : "bg-white/5 text-gray-200 border border-white/5"
            )}
          >
            {message.content}
            {message.isStreaming && (
              <span className="inline-block w-1.5 h-4 bg-accent ml-0.5 animate-pulse" />
            )}
          </div>
        )}

        {/* Tool call indicators */}
        {message.toolCalls && message.toolCalls.length > 0 && (
          <div className="space-y-1.5">
            {message.toolCalls.map((tool) => (
              <ToolCallIndicator key={tool.id} toolCall={tool} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
