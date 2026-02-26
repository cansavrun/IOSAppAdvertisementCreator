export type ProjectStatus = "active" | "archived";
export type MediaType = "image" | "video" | "screenshot";
export type MediaStatus = "queued" | "generating" | "completed" | "failed";

export interface Profile {
  id: string;
  firebase_uid: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
  thumbnail_url?: string | null;
  media_count?: number;
}

export interface MediaItem {
  id: string;
  project_id: string;
  type: MediaType;
  status: MediaStatus;
  prompt: string | null;
  fal_model: string;
  fal_request_id: string | null;
  input: Record<string, unknown>;
  output: Record<string, unknown> | null;
  result_url: string | null;
  storage_path: string | null;
  thumbnail_path: string | null;
  parent_id: string | null;
  error_message: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface ChatMessage {
  id: string;
  project_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  tool_calls: Record<string, unknown>[] | null;
  media_item_ids: string[] | null;
  created_at: string;
}

export interface UploadedFile {
  id: string;
  user_id: string;
  project_id: string | null;
  file_name: string;
  file_size: number;
  mime_type: string;
  storage_path: string;
  fal_url: string | null;
  created_at: string;
}
