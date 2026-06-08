import { create } from "zustand";

import { HeaderState } from "@/types";

export const useHeaderStore = create<HeaderState>((set) => ({
  title: null,
  subtitle: null,
  setHeader: (title, subtitle = null) => set({ title, subtitle }),
  clearHeader: () => set({ title: null, subtitle: null }),
}));
