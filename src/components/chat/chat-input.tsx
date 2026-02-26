"use client";

import { useState, useRef, useCallback } from "react";
import { useChatStore } from "@/stores/chat-store";
import { sendChatMessage } from "@/lib/chat-client";

export function ChatInput() {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isStreaming } = useChatStore();

  const handleSend = useCallback(
    async (text?: string) => {
      const trimmed = (text || input).trim();
      if (!trimmed || isStreaming) return;

      // Add user message to chat
      useChatStore.getState().addMessage({
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
        createdAt: new Date().toISOString(),
      });

      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      // Send to Claude and stream response
      await sendChatMessage(trimmed);
    },
    [input, isStreaming]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  return (
    <div className="border-t border-white/10 p-3">
      <div className="flex items-end gap-2 bg-white/5 rounded-xl border border-white/10 p-2">
        <button
          className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          title="Attach image"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </button>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Describe what you want to create..."
          rows={1}
          disabled={isStreaming}
          className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 resize-none focus:outline-none max-h-40 py-2"
        />

        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isStreaming}
          className="p-2 rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19V5m0 0l-7 7m7-7l7 7"
            />
          </svg>
        </button>
      </div>
      <p className="text-xs text-gray-600 mt-1.5 text-center">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}
