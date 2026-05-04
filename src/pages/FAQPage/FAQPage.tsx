import FAQ from "../Home/FAQ/FAQ";
import { motion } from "framer-motion";

const FAQPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-[#0B0F19] py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-white mb-6"
          >
            Help <span className="text-[#1E5AA8]">Center</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Find everything you need to know about our services, tracking, 
            and more. We're here to help you move your goods safely.
          </motion.p>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQ 
        limit={10} 
        showSearch={true} 
        showCategories={true} 
        title="Comprehensive FAQ Guide"
        subtitle="Browse through our categories or search for specific answers."
      />
    </div>
  );
};

export default FAQPage;
