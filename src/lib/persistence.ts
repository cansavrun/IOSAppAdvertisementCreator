import type { MediaItem } from "@/types/database";
import type { ChatMessageUI } from "@/types/chat";

/**
 * Saves a chat message to the database (fire-and-forget).
 */
export function persistChatMessage(
  projectId: string,
  message: ChatMessageUI
): void {
  if (projectId === "default" || !projectId) return;

  fetch("/api/chat/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: message.id,
      project_id: projectId,
      role: message.role,
      content: message.content,
      tool_calls: message.toolCalls,
    }),
  }).catch((err) => console.error("Failed to save chat message:", err));
}

/**
 * Saves/updates a media item in the database (fire-and-forget).
 */
export function persistMediaItem(
  projectId: string,
  item: MediaItem
): void {
  if (projectId === "default" || !projectId) return;

  fetch("/api/media-items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...item,
      project_id: projectId,
    }),
  }).catch((err) => console.error("Failed to save media item:", err));
}

/**
 * Creates a new project and returns its ID.
 */
export async function createProject(
  title?: string
): Promise<string | null> {
  try {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title || "Untitled Project" }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.id;
  } catch {
    return null;
  }
}

/**
 * Updates a project title based on the first user message.
 */
export function updateProjectTitle(
  projectId: string,
  title: string
): void {
  if (projectId === "default" || !projectId) return;

  fetch(`/api/projects/${projectId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: title.slice(0, 60) }),
  }).catch((err) => console.error("Failed to update project title:", err));
}
