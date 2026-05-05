import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Layout, 
  Image as ImageIcon, 
  Settings, 
  Plus, 
  Trash2, 
  Save, 
  Truck,
  Zap,
  Star
} from "lucide-react";
import toast from "react-hot-toast";

const LandingPageManager = () => {
  const [activeTab, setActiveTab] = useState("banners");
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // ─── DATA FETCHING ──────────────────────────────────────────────────────────

  const { data: banners = [], isLoading: bannersLoading } = useQuery({
    queryKey: ["admin-banners"],
    queryFn: async () => {
      const res = await axiosSecure.get("/landing/banners");
      return res.data.data;
    },
  });

  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const res = await axiosSecure.get("/landing/services");
      return res.data.data;
    },
  });

  // Fetch features, partners, processSteps for future implementation in UI tabs
  useQuery({
    queryKey: ["admin-features"],
    queryFn: async () => {
      const res = await axiosSecure.get("/landing/features");
      return res.data.data;
    },
  });

  useQuery({
    queryKey: ["admin-partners"],
    queryFn: async () => {
      const res = await axiosSecure.get("/landing/partners");
      return res.data.data;
    },
  });

  const { data: config, isLoading: configLoading } = useQuery({
    queryKey: ["admin-config"],
    queryFn: async () => {
      const res = await axiosSecure.get("/landing/config");
      return res.data.data;
    },
  });

  useQuery({
    queryKey: ["admin-steps"],
    queryFn: async () => {
      const res = await axiosSecure.get("/landing/process-steps");
      return res.data.data;
    },
  });

  // ─── MUTATIONS ──────────────────────────────────────────────────────────────

  const updateConfigMutation = useMutation({
    mutationFn: async (newData: any) => {
      await axiosSecure.patch("/landing/config", newData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-config"] });
      toast.success("Configuration updated!");
    },
  });

  const handleSaveConfig = () => {
    // In a real scenario, we'd gather form data here
    // For now, we'll just trigger the mutation with existing data as a demo
    updateConfigMutation.mutate(config);
  };

  // ─── RENDER HELPERS ────────────────────────────────────────────────────────

  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all ${
        activeTab === id 
        ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
        : "bg-white text-slate-500 hover:bg-slate-50"
      }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );

  if (bannersLoading || servicesLoading || configLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Landing Page Manager</h1>
          <p className="text-slate-500 font-medium mt-1">Customize the frontend content and aesthetics</p>
        </div>
        <div className="flex gap-3">
           <button className="btn btn-primary rounded-2xl font-black px-6">
             <Plus size={20} />
             Add Content
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 pb-4">
        <TabButton id="banners" label="Hero Banners" icon={ImageIcon} />
        <TabButton id="services" label="Services" icon={Zap} />
        <TabButton id="features" label="Features" icon={Truck} />
        <TabButton id="partners" label="Partners" icon={Star} />
        <TabButton id="steps" label="Process Steps" icon={Settings} />
        <TabButton id="config" label="Global Config" icon={Layout} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm"
        >
          {activeTab === "banners" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {banners.map((banner: any) => (
                <div key={banner._id} className="group relative bg-slate-50 rounded-3xl overflow-hidden border border-slate-200">
                  <div className="h-48 relative">
                    <img src={banner.image} className="w-full h-full object-cover" alt={banner.title} />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-3 bg-white rounded-full text-red-500 hover:scale-110 transition-transform">
                         <Trash2 size={20} />
                       </button>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 className="font-black text-xl text-slate-900">{banner.title}</h3>
                    <p className="text-slate-500 text-sm font-medium line-clamp-2">{banner.subtitle}</p>
                    <div className="flex justify-between items-center pt-2">
                       <span className="text-xs font-bold px-3 py-1 bg-primary/10 text-primary rounded-full">
                         Order: {banner.order}
                       </span>
                       <button className="text-primary font-bold text-sm hover:underline">Edit Slide</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "services" && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {services.map((service: any) => (
                <div key={service._id} className="p-6 bg-slate-50 rounded-3xl border border-slate-200 flex flex-col gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary">
                    <Settings size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-slate-900">{service.title}</h3>
                    <p className="text-slate-500 text-sm font-medium mt-1">{service.description}</p>
                  </div>
                  <div className="flex justify-end mt-auto pt-4 gap-2">
                    <button className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                    <button className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-primary transition-colors">
                      <Settings size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "config" && (
            <div className="max-w-4xl space-y-12">
              {/* Merchant Section */}
              <section className="space-y-6">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                   <div className="w-2 h-8 bg-primary rounded-full" />
                   Merchant Section Content
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Main Headline</label>
                    <input 
                      type="text" 
                      defaultValue={config?.merchantSection?.title}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary font-bold text-slate-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Description Text</label>
                    <textarea 
                      rows={4}
                      defaultValue={config?.merchantSection?.description}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary font-medium text-slate-600"
                    />
                  </div>
                </div>
              </section>

              {/* How It Works Header */}
              <section className="space-y-6">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                   <div className="w-2 h-8 bg-[#1E5AA8] rounded-full" />
                   How It Works Header
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Section Title</label>
                    <input 
                      type="text" 
                      defaultValue={config?.howItWorksHeader?.title}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary font-bold text-slate-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Footer Quote</label>
                    <input 
                      type="text" 
                      defaultValue={config?.howItWorksFooter}
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary font-bold text-slate-800"
                    />
                  </div>
                </div>
              </section>

              <div className="flex justify-end pt-8">
                <button 
                  onClick={handleSaveConfig}
                  className="btn btn-primary rounded-2xl font-black px-12 shadow-xl shadow-primary/20"
                >
                  <Save size={20} />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Fallback for other tabs */}
          {!["banners", "services", "config"].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                 <Layout size={40} />
               </div>
               <h3 className="text-xl font-black text-slate-900">Module Under Construction</h3>
               <p className="text-slate-500 font-medium max-w-sm">We are refining the management interface for this section to provide the best experience.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LandingPageManager;
