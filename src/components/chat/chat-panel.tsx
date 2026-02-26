"use client";

import { useChatStore } from "@/stores/chat-store";
import { sendChatMessage } from "@/lib/chat-client";
import { ChatMessageBubble } from "./chat-message";
import { ChatInput } from "./chat-input";
import { useRef, useEffect, useCallback } from "react";

export function ChatPanel() {
  const { messages, isStreaming } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSuggestion = useCallback(
    async (text: string) => {
      if (isStreaming) return;
      useChatStore.getState().addMessage({
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        createdAt: new Date().toISOString(),
      });
      await sendChatMessage(text);
    },
    [isStreaming]
  );

  return (
    <div className="flex flex-col h-full bg-surface border-r border-white/10">
      {/* Chat header */}
      <div className="h-12 border-b border-white/10 flex items-center px-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm font-medium text-white">AI Copilot</span>
        </div>
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-white font-medium mb-2">
              What would you like to create?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Describe your idea and I&apos;ll generate it for you. You can
              create reels, posts, or app screenshots.
            </p>
            <div className="space-y-2 w-full">
              {[
                "Create an Instagram reel of a sunset beach",
                "Make a minimal product post on white background",
                "Generate App Store screenshots for my app",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  className="w-full text-left text-sm text-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors border border-white/5 hover:border-white/10"
                  onClick={() => handleSuggestion(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessageBubble key={message.id} message={message} />
          ))
        )}

        {isStreaming && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" />
              <div
                className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce"
                style={{ animationDelay: "0.15s" }}
              />
              <div
                className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce"
                style={{ animationDelay: "0.3s" }}
              />
            </div>
            <span>Thinking...</span>
          </div>
        )}
      </div>

      {/* Input area */}
      <ChatInput />
    </div>
  );
}
