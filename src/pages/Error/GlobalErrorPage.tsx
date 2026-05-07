import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { FiAlertTriangle, FiArrowLeft, FiHome, FiRefreshCw } from "react-icons/fi";

const GlobalErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = "Unexpected Error";
  let message = "Something went wrong on our end. Our engineers have been notified.";
  let status = 500;

  if (isRouteErrorResponse(error)) {
    status = error.status;
    if (status === 404) {
      title = "Page Not Found";
      message = "The logistics hub you are looking for doesn't exist or has been moved.";
    } else if (status === 401) {
      title = "Unauthorized";
      message = "Your session has expired. Please log in again to continue.";
    } else if (status === 503) {
      title = "Service Unavailable";
      message = "Our servers are currently undergoing maintenance. Please try again later.";
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-urbanist">
      <div className="max-w-xl w-full text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8 flex justify-center"
        >
          <div className="w-24 h-24 rounded-3xl bg-red-100 flex items-center justify-center text-red-600 shadow-2xl shadow-red-200">
            <FiAlertTriangle size={48} />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-7xl font-black text-slate-900 mb-4"
        >
          {status}
        </motion.h1>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-black text-slate-800 mb-4 uppercase tracking-tight"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-slate-500 font-medium text-lg mb-12 leading-relaxed"
        >
          {message}
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-700 font-black rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <FiArrowLeft /> Go Back
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full sm:w-auto px-8 py-4 bg-[#2E7D32] text-white font-black rounded-2xl hover:bg-slate-900 transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#2E7D32]/20"
          >
            <FiHome /> Back to Home
          </button>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={() => window.location.reload()}
          className="mt-12 text-slate-400 hover:text-slate-600 font-bold text-sm flex items-center justify-center gap-2 mx-auto transition-colors"
        >
          <FiRefreshCw className="animate-spin-slow" /> Try Refreshing the page
        </motion.button>
      </div>
    </div>
  );
};

export default GlobalErrorPage;
