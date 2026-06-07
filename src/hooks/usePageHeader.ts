"use client";

import { useEffect } from "react";
import { useHeaderStore } from "../store/useHeaderStore";

export const usePageHeader = (title: string, subtitle?: string | null) => {
  const { setHeader } = useHeaderStore();

  useEffect(() => {
    setHeader(title, subtitle);
    // Optional: clear header on unmount to prevent leaked titles
    // return () => clearHeader();
  }, [title, subtitle, setHeader]);
};
