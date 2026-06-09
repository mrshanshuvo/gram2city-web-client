"use client";

import { useEffect } from "react";
import { useHeaderStore } from "../store/useHeaderStore";

export const usePageHeader = (title: string, subtitle?: string | null) => {
  const { setHeader, clearHeader } = useHeaderStore();

  useEffect(() => {
    setHeader(title, subtitle);
    // Clear header on unmount so navigating away doesn't leave a stale title
    return () => clearHeader();
  }, [title, subtitle, setHeader, clearHeader]);
};
