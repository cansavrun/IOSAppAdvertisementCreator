import { create } from "zustand";
import type { MediaItem } from "@/types/database";

interface CanvasState {
  items: MediaItem[];
  selectedItemId: string | null;
  layout: "grid" | "list";

  addItem: (item: MediaItem) => void;
  updateItem: (id: string, update: Partial<MediaItem>) => void;
  removeItem: (id: string) => void;
  selectItem: (id: string | null) => void;
  setLayout: (layout: "grid" | "list") => void;
  clearItems: () => void;
  loadItems: (items: MediaItem[]) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  items: [],
  selectedItemId: null,
  layout: "grid",

  addItem: (item) =>
    set((state) => ({ items: [item, ...state.items] })),

  updateItem: (id, update) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...update } : item
      ),
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
      selectedItemId:
        state.selectedItemId === id ? null : state.selectedItemId,
    })),

  selectItem: (id) => set({ selectedItemId: id }),

  setLayout: (layout) => set({ layout }),

  clearItems: () => set({ items: [], selectedItemId: null }),

  loadItems: (items) => set({ items }),
}));
