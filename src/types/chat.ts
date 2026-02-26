export interface ChatMessageUI {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolCalls?: ToolCallUI[];
  mediaItemIds?: string[];
  isStreaming?: boolean;
  createdAt: string;
}

export interface ToolCallUI {
  id: string;
  name: string;
  input: Record<string, unknown>;
  status: "pending" | "running" | "completed" | "failed";
  result?: string;
}

export interface ChatRequest {
  message: string;
  projectId: string;
  conversationHistory: ChatMessageUI[];
  canvasState: {
    selectedItemId: string | null;
    items: Array<{
      id: string;
      type: string;
      status: string;
      prompt: string | null;
      result_url: string | null;
    }>;
  };
}
