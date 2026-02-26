import { MediaItem } from "./database";

export interface CanvasState {
  items: MediaItem[];
  selectedItemId: string | null;
  layout: "grid" | "list";
}
