import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./router/router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import "aos/dist/aos.css";
import Aos from "aos";
import { Toaster } from "sonner";
import AuthInitializer from "./AuthInitializer";
import { HelmetProvider } from "react-helmet-async";

Aos.init();



const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

createRoot(rootElement).render(
  <StrictMode>
    <div className="font-urbanist">
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <AuthInitializer />
          <RouterProvider router={router} />
            <Toaster
              position="top-center"
              richColors
              toastOptions={{
                style: {
                  borderRadius: "1.25rem",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                },
                classNames: {
                  success:
                    "!bg-[#2E7D32]/95 !text-white shadow-2xl shadow-[#2E7D32]/20",
                  error:
                    "!bg-red-600/95 !text-white shadow-2xl shadow-red-600/20",
                  info: "!bg-[#1E5AA8]/95 !text-white shadow-2xl shadow-[#1E5AA8]/20",
                  warning:
                    "!bg-[#F4C20D]/95 !text-slate-900 shadow-2xl shadow-[#F4C20D]/20",
                  toast: "group !backdrop-blur-2xl !border-white/20",
                },
              }}
            />
        </HelmetProvider>
      </QueryClientProvider>
    </div>
  </StrictMode>,
);
