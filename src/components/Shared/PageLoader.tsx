import { Loader2 } from "lucide-react";

const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-[9999] flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-[#2E7D32] animate-spin" />
        <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#1E5AA8]" size={24} />
      </div>
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Gram2City</h2>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest animate-pulse">
          Loading your experience...
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
