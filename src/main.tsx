import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./router/router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'aos/dist/aos.css';
import Aos from "aos";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import AuthProvider from "./contexts/AuthContext/AuthProvider";

Aos.init();

// Create QueryClient instance
const queryClient = new QueryClient();

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

createRoot(rootElement).render(
  <StrictMode>
    <div className="font-urbanist">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
          <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        </AuthProvider>
      </QueryClientProvider>
    </div>
  </StrictMode>
);
