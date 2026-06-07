"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Redirect({ to, replace }: { to: string; replace?: boolean }) {
  const router = useRouter();
  useEffect(() => {
    if (replace) router.replace(to);
    else router.push(to);
  }, [router, to, replace]);
  return null;
}
