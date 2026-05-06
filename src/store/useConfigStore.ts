import { create } from "zustand";

interface ConfigState {
  sidebarOpen: boolean;
  theme: "light" | "dark";
  toggleSidebar: () => void;
  setSidebar: (open: boolean) => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  sidebarOpen: true,
  theme: "light",
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebar: (open) => set({ sidebarOpen: open }),
  setTheme: (theme) => set({ theme }),
}));
