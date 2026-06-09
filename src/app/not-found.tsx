"use client";

import React from "react";
import Link from "next/link";
import { FiHome, FiArrowLeft, FiMapPin } from "react-icons/fi";
import Gram2CityLogo from "@/components/Shared/Gram2CityLogo/Gram2CityLogo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 blur-[100px] rounded-full -ml-48 -mb-48" />

      <div className="relative z-10 max-w-md w-full text-center space-y-8 p-10 bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-slate-100/50">
        {/* Brand Logo */}
        <div className="flex justify-center scale-110">
          <Gram2CityLogo />
        </div>

        {/* 404 Graphic/Icon */}
        <div className="relative flex items-center justify-center my-6">
          <div className="absolute w-24 h-24 bg-rose-50 rounded-full animate-ping opacity-20"></div>
          <div className="relative w-20 h-20 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-100">
            <FiMapPin size={36} className="animate-bounce" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">
            404
          </h1>
          <h2 className="text-lg font-black text-slate-700 tracking-tight">
            Lost in Transit
          </h2>
          <p className="text-sm text-slate-400 font-medium leading-relaxed">
            The page you are looking for has been moved, redirected, or does not
            exist in our route list.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => window.history.back()}
            className="flex-1 h-12 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <FiArrowLeft /> Back
          </button>
          <Link
            href="/dashboard"
            className="flex-1 h-12 bg-primary hover:bg-primary/95 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 cursor-pointer"
          >
            <FiHome /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
