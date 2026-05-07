import { create } from "zustand";

interface HeaderState {
  title: string | null;
  subtitle: string | null;
  setHeader: (title: string, subtitle?: string | null) => void;
  clearHeader: () => void;
}

export const useHeaderStore = create<HeaderState>((set) => ({
  title: null,
  subtitle: null,
  setHeader: (title, subtitle = null) => set({ title, subtitle }),
  clearHeader: () => set({ title: null, subtitle: null }),
}));
