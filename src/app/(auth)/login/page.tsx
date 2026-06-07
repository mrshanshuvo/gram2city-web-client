"use client";

import dynamic from "next/dynamic";

const Component = dynamic(() => import("@/views/Authentication/Login/Login"), {
  ssr: false,
});

export default function Page() {
  return (
    <Component />
  );
}
