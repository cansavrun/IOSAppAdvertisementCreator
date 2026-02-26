import { create } from "zustand";
import type { Profile } from "@/types/database";

interface AuthState {
  user: Profile | null;
  loading: boolean;
  setUser: (user: Profile | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
}));
