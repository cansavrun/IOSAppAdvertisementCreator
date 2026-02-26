"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChatPanel } from "@/components/chat/chat-panel";
import { CanvasWorkspace } from "@/components/canvas/canvas-workspace";
import { useChatStore } from "@/stores/chat-store";
import { useCanvasStore } from "@/stores/canvas-store";
import { useProjectsStore } from "@/stores/projects-store";
import { Spinner } from "@/components/ui/spinner";
import type { ChatMessageUI } from "@/types/chat";

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("Untitled Project");

  useEffect(() => {
    async function loadProject() {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (!res.ok) {
          router.push("/dashboard");
          return;
        }

        const data = await res.json();
        setTitle(data.title);

        // Set project context in stores
        useChatStore.getState().setProjectId(projectId);
        useProjectsStore.getState().setCurrentProjectId(projectId);

        // Load media items into canvas
        if (data.media_items?.length > 0) {
          useCanvasStore.getState().loadItems(data.media_items);
        }

        // Load chat messages
        if (data.chat_messages?.length > 0) {
          const messages: ChatMessageUI[] = data.chat_messages.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (m: any) => ({
              id: m.id,
              role: m.role,
              content: m.content,
              toolCalls: m.tool_calls,
              createdAt: m.created_at,
            })
          );
          useChatStore.getState().loadMessages(messages);
        }
      } catch {
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadProject();

    return () => {
      // Clean up on unmount
      useChatStore.getState().clearMessages();
      useCanvasStore.getState().clearItems();
      useProjectsStore.getState().setCurrentProjectId(null);
    };
  }, [projectId, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Project title bar */}
      <div className="h-10 border-b border-white/10 flex items-center px-4 shrink-0">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-xs text-gray-500 hover:text-white mr-3 transition-colors"
        >
          &larr; Projects
        </button>
        <h1 className="text-sm font-medium text-white truncate">{title}</h1>
      </div>

      {/* Chat + Canvas */}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[380px] min-w-[320px] shrink-0">
          <ChatPanel />
        </div>
        <div className="flex-1 bg-background">
          <CanvasWorkspace />
        </div>
      </div>
    </div>
  );
}
