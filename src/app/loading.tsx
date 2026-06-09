"use client";

import React from "react";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-slate-50/80 backdrop-blur-md flex flex-col items-center justify-center z-9999 animate-in fade-in duration-300">
      <div className="relative flex flex-col items-center gap-6 p-10 bg-white/70 rounded-3xl border border-white/20 shadow-2xl">
        {/* Animated Spin Outer Border */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-secondary border-b-accent border-l-transparent animate-spin"></div>

          {/* Centered Brand Icon */}
          <div className="relative w-16 h-16 bg-white rounded-2xl shadow-md p-2.5 flex items-center justify-center">
            <Image
              src="/assets/logo/landscape-logo.png"
              alt="Gram2City logo"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Pulse text */}
        <div className="flex flex-col items-center gap-1.5">
          <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-1 animate-pulse">
            <span className="text-primary">Gram</span>
            <span className="text-accent">2</span>
            <span className="text-secondary">City</span>
          </h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Dispatching Logistics...
          </p>
        </div>
      </div>
    </div>
  );
}
