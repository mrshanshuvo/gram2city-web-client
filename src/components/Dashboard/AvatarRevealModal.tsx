"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Ship } from "lucide-react";
import { useAuthStore } from "../../features/auth/authStore";

const AvatarRevealModal = () => {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const hasSeenReveal = localStorage.getItem(`reveal_seen_${user.uid}`);
      if (!hasSeenReveal) {
        // Trigger reveal after a short delay
        const timer = setTimeout(() => setIsOpen(true), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  const closeReveal = () => {
    if (user) {
      localStorage.setItem(`reveal_seen_${user.uid}`, "true");
    }
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 backdrop-blur-[3px]">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative w-full max-w-lg bg-white rounded-[3rem] p-10 overflow-hidden shadow-2xl text-center"
          >
            {/* Background Sparkles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5],
                    x: Math.random() * 400 - 200,
                    y: Math.random() * 400 - 200,
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                  className="absolute left-1/2 top-1/2 w-2 h-2 bg-[#F4C20D] rounded-full blur-[1px]"
                />
              ))}
            </div>

            <button
              onClick={closeReveal}
              className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="relative space-y-8">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-1 bg-[#F4C20D] rounded-full mb-6" />
                <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  Welcome to <br />
                  <span className="text-[#2E7D32]">Gram2City</span>
                </h2>
              </motion.div>

              {/* Avatar Box */}
              <div className="flex justify-center">
                <motion.div
                  initial={{ rotateY: 180, scale: 0.5, opacity: 0 }}
                  animate={{ rotateY: 0, scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 20,
                    delay: 0.6,
                  }}
                  className="relative"
                >
                  <div className="w-48 h-48 rounded-[3rem] bg-slate-50 border-8 border-white shadow-2xl overflow-hidden relative group">
                    <img
                      src={user?.photoURL || ""}
                      alt="Assigned Avatar"
                      className="w-full h-full object-cover"
                    />
                    {/* Gloss Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
                  </div>

                  {/* Floating Elements */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -bottom-4 -right-4 p-4 bg-[#2E7D32] text-white rounded-2xl shadow-xl border-4 border-white"
                  >
                    <Ship size={24} />
                  </motion.div>
                </motion.div>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className="space-y-6"
              >
                <p className="text-slate-500 font-medium text-lg px-4">
                  We've assigned you a **unique explorer avatar** to get you
                  started! Feel free to keep it or upload your own photo later.
                </p>
                <button
                  onClick={closeReveal}
                  className="w-full py-4 bg-[#2E7D32] hover:bg-[#1E5AA8] text-white font-black rounded-2xl shadow-xl shadow-[#2E7D32]/20 transition-all flex items-center justify-center gap-2 group"
                >
                  <Sparkles size={20} />
                  Start Shipping
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AvatarRevealModal;
