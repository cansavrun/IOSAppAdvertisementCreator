import { create } from "zustand";
import type { ChatMessageUI } from "@/types/chat";

interface ChatState {
  messages: ChatMessageUI[];
  isStreaming: boolean;
  projectId: string | null;

  addMessage: (message: ChatMessageUI) => void;
  updateMessage: (id: string, update: Partial<ChatMessageUI>) => void;
  appendToMessage: (id: string, text: string) => void;
  setStreaming: (streaming: boolean) => void;
  setProjectId: (projectId: string) => void;
  clearMessages: () => void;
  loadMessages: (messages: ChatMessageUI[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isStreaming: false,
  projectId: null,

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  updateMessage: (id, update) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, ...update } : m
      ),
    })),

  appendToMessage: (id, text) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, content: m.content + text } : m
      ),
    })),

  setStreaming: (isStreaming) => set({ isStreaming }),

  setProjectId: (projectId) => set({ projectId }),

  clearMessages: () => set({ messages: [] }),

  loadMessages: (messages) => set({ messages }),
}));
