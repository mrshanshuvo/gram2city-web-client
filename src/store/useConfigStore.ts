import { create } from "zustand";

import { ConfigState } from "@/types";

export const useConfigStore = create<ConfigState>((set) => ({
  sidebarOpen: true,
  theme: "light",
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebar: (open) => set({ sidebarOpen: open }),
  setTheme: (theme) => set({ theme }),
}));
