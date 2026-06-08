import React from "react";

interface SkeletonProps {
  className?: string;
  dark?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({ className, dark }) => {
  return (
    <div
      className={`animate-pulse rounded-xl ${dark ? "bg-white/5" : "bg-slate-200"} ${className} relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-linear-to-r ${dark ? "before:via-white/5" : "before:via-white/20"} before:from-transparent before:to-transparent`}
    />
  );
};

export const BannerSkeleton = () => (
  <div className="relative h-150 w-full bg-slate-100 overflow-hidden">
    <div className="max-w-350 mx-auto px-6 h-full flex items-center">
      <div className="max-w-2xl space-y-6">
        <Skeleton className="h-4 w-32 rounded-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-3/4" />
        <Skeleton className="h-12 w-1/2 mt-8" />
      </div>
    </div>
  </div>
);

export const CardSkeleton = () => (
  <div className="p-8 rounded-[2.5rem] border border-slate-100 bg-white space-y-6">
    <Skeleton className="h-12 w-12" />
    <div className="space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  </div>
);

export default Skeleton;
