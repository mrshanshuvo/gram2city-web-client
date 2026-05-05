import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Layout, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Save, 
  Zap,
  UserCircle,
  Wand2,
  RefreshCcw,
  Loader2,
  Edit3,
  Globe,
  Star
} from "lucide-react";
import { toast } from "sonner";
import BannerModal from "./BannerModal";
import ServiceModal from "./ServiceModal";
import ProcessStepModal from "./ProcessStepModal";
import FeatureModal from "./FeatureModal";

const LandingPageManager = () => {
  const [activeTab, setActiveTab] = useState("banners");
  const [modalState, setModalState] = useState<{ type: string | null; data: any | null }>({ type: null, data: null });
  
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

  const { data: features = [], isLoading: featuresLoading } = useQuery({
    queryKey: ["admin-features"],
    queryFn: async () => {
      const res = await axiosSecure.get("/landing/features");
      return res.data.data;
    },
  });

  const { data: avatars = [], isLoading: avatarsLoading } = useQuery({
    queryKey: ["admin-avatars"],
    queryFn: async () => {
      const res = await axiosSecure.get("/avatars");
      return res.data;
    },
  });

  const { data: config, isLoading: configLoading } = useQuery({
    queryKey: ["admin-config"],
    queryFn: async () => {
      const res = await axiosSecure.get("/landing/config");
      return res.data.data;
    },
  });

  const { data: processSteps = [], isLoading: stepsLoading } = useQuery({
    queryKey: ["admin-process-steps"],
    queryFn: async () => {
      const res = await axiosSecure.get("/landing/process-steps");
      return res.data.data;
    },
  });

  // ─── MUTATIONS ──────────────────────────────────────────────────────────────

  const createMutation = useMutation({
    mutationFn: async ({ type, data }: { type: string, data: any }) => {
      const endpoint = type === "processSteps" ? "process-steps" : type;
      await axiosSecure.post(`/landing/${endpoint}`, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`admin-${variables.type}`] });
      toast.success(`${variables.type} created successfully!`);
      setModalState({ type: null, data: null });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Operation failed"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ type, id, data }: { type: string, id: string, data: any }) => {
      const endpoint = type === "processSteps" ? "process-steps" : type;
      await axiosSecure.patch(`/landing/${endpoint}/${id}`, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`admin-${variables.type}`] });
      toast.success(`${variables.type} updated!`);
      setModalState({ type: null, data: null });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "Update failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ type, id }: { type: string, id: string }) => {
      const endpoint = type === "processSteps" ? "process-steps" : type;
      await axiosSecure.delete(`/landing/${endpoint}/${id}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`admin-${variables.type}`] });
      toast.success("Item removed successfully.");
    },
  });

  const updateConfigMutation = useMutation({
    mutationFn: async (newData: any) => {
      await axiosSecure.patch("/landing/config", newData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-config"] });
      toast.success("Global configuration saved!");
    },
  });

  const generateAvatarsMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosSecure.post("/avatars/magic-generate", { style: "lorelei", count: 12 });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-avatars"] });
      toast.success("12 New magic avatars generated!");
    },
  });

  const deleteAvatarMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosSecure.delete(`/avatars/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-avatars"] });
      toast.success("Avatar removed.");
    },
  });

  // ─── HANDLERS ──────────────────────────────────────────────────────────────

  const handleModalSubmit = (data: any) => {
    if (modalState.data) {
      updateMutation.mutate({ type: modalState.type!, id: modalState.data._id, data });
    } else {
      createMutation.mutate({ type: modalState.type!, data });
    }
  };

  const handleSaveConfig = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newData = {
      merchantSection: {
        title: formData.get("title"),
        description: formData.get("description"),
        benefits: config?.merchantSection?.benefits || [],
        ctaText: config?.merchantSection?.ctaText || "Join as Merchant",
        ctaLink: config?.merchantSection?.ctaLink || "/register"
      }
    };
    updateConfigMutation.mutate(newData);
  };

  // ─── RENDER HELPERS ────────────────────────────────────────────────────────

  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all ${
        activeTab === id 
        ? "bg-[#2E7D32] text-white shadow-lg shadow-[#2E7D32]/20 scale-105" 
        : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
      }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );

  const AddButton = ({ label, onClick }: any) => (
    <button 
      onClick={onClick}
      className="btn bg-[#2E7D32] hover:bg-[#1E5AA8] text-white border-none rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-[#2E7D32]/20 px-6"
    >
      <Plus size={20} />
      {label}
    </button>
  );

  if (bannersLoading || servicesLoading || configLoading || avatarsLoading || stepsLoading || featuresLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-[#2E7D32]" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Identity & Content</h1>
          <p className="text-slate-500 font-medium mt-1">Manage branding, visuals, and onboarding flow</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 pb-4">
        <TabButton id="banners" label="Hero Banners" icon={ImageIcon} />
        <TabButton id="services" label="Services" icon={Zap} />
        <TabButton id="features" label="Features" icon={Star} />
        <TabButton id="steps" label="Process Steps" icon={RefreshCcw} />
        <TabButton id="avatars" label="Avatar Library" icon={UserCircle} />
        <TabButton id="config" label="Global Config" icon={Layout} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm min-h-[400px]"
        >
          {activeTab === "banners" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-black text-slate-900">Banner Slides</h3>
                 <AddButton label="Add Banner" onClick={() => setModalState({ type: "banners", data: null })} />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {banners.map((banner: any) => (
                  <div key={banner._id} className="group relative bg-slate-50 rounded-3xl overflow-hidden border border-slate-200">
                    <div className="h-48 relative">
                      <img src={banner.image} className="w-full h-full object-cover" alt={banner.title} />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-3">
                         <button 
                           onClick={() => setModalState({ type: "banners", data: banner })}
                           className="p-3 bg-white rounded-full text-blue-500 hover:scale-110 transition-transform"
                         >
                           <Edit3 size={20} />
                         </button>
                         <button 
                           onClick={() => deleteMutation.mutate({ type: "banners", id: banner._id })}
                           className="p-3 bg-white rounded-full text-red-500 hover:scale-110 transition-transform"
                         >
                           <Trash2 size={20} />
                         </button>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <h3 className="font-black text-xl text-slate-900">{banner.title}</h3>
                      <p className="text-slate-500 text-sm font-medium line-clamp-2">{banner.subtitle}</p>
                      <div className="flex justify-between items-center pt-2">
                         <span className="text-xs font-bold px-3 py-1 bg-[#2E7D32]/10 text-[#2E7D32] rounded-full">
                           Order: {banner.order}
                         </span>
                         <span className={`text-xs font-bold px-3 py-1 rounded-full ${banner.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                           {banner.isActive ? "Active" : "Inactive"}
                         </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "services" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-black text-slate-900">Logistics Services</h3>
                 <AddButton label="Add Service" onClick={() => setModalState({ type: "services", data: null })} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {services.map((service: any) => (
                  <div key={service._id} className="p-6 bg-slate-50 rounded-3xl border border-slate-200 flex flex-col gap-4 group">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#2E7D32]">
                      <Zap size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-slate-900">{service.title}</h3>
                      <p className="text-slate-500 text-sm font-medium mt-1 line-clamp-3">{service.description}</p>
                    </div>
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-200/50">
                       <span className="text-xs font-bold text-slate-400">Order: {service.order}</span>
                       <div className="flex gap-1">
                        <button 
                          onClick={() => setModalState({ type: "services", data: service })}
                          className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-[#2E7D32] transition-colors"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => deleteMutation.mutate({ type: "services", id: service._id })}
                          className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "features" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-black text-slate-900">Featured Cards</h3>
                 <AddButton label="Add Feature" onClick={() => setModalState({ type: "features", data: null })} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {features.map((feature: any) => (
                  <div key={feature._id} className="p-6 bg-slate-50 rounded-3xl border border-slate-200 flex flex-col gap-4 group">
                    <div className="h-40 rounded-2xl overflow-hidden border border-slate-100">
                       <img src={feature.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-slate-900">{feature.title}</h3>
                      <p className="text-slate-500 text-sm font-medium mt-1 line-clamp-2">{feature.description}</p>
                    </div>
                    <div className="flex justify-between items-center mt-auto">
                       <span className="text-xs font-bold text-slate-400">Order: {feature.order}</span>
                       <div className="flex gap-1">
                        <button 
                          onClick={() => setModalState({ type: "features", data: feature })}
                          className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-blue-500 transition-colors"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => deleteMutation.mutate({ type: "features", id: feature._id })}
                          className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "steps" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-black text-slate-900">How it Works Flow</h3>
                 <AddButton label="Add Step" onClick={() => setModalState({ type: "processSteps", data: null })} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {processSteps.map((step: any) => (
                  <div key={step._id} className="p-6 bg-slate-50 rounded-3xl border border-slate-200 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                       <div className="w-10 h-10 bg-[#2E7D32] text-white rounded-xl flex items-center justify-center font-black">
                         {step.order}
                       </div>
                       <div className="flex gap-1">
                          <button 
                            onClick={() => setModalState({ type: "processSteps", data: step })}
                            className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-blue-500 transition-colors"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button 
                            onClick={() => deleteMutation.mutate({ type: "processSteps", id: step._id })}
                            className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                       </div>
                    </div>
                    <div>
                      <h3 className="font-black text-xl text-slate-900">{step.title}</h3>
                      <p className="text-slate-500 text-sm font-medium mt-1">{step.description}</p>
                    </div>
                    {step.steps?.length > 0 && (
                      <div className="space-y-2 mt-2">
                        {step.steps.map((s: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-white/50 p-2 rounded-lg">
                            <div className="w-1.5 h-1.5 bg-[#2E7D32] rounded-full" />
                            {s}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "avatars" && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div>
                  <h3 className="text-xl font-black text-slate-900">User Avatar Vault</h3>
                  <p className="text-slate-500 font-medium text-sm">System-assigned avatars for new registrations</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => generateAvatarsMutation.mutate()}
                    disabled={generateAvatarsMutation.isPending}
                    className="btn bg-[#F4C20D] hover:bg-[#EBC00D] text-slate-900 border-none rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-[#F4C20D]/20 disabled:opacity-50"
                  >
                    {generateAvatarsMutation.isPending ? <RefreshCcw className="animate-spin" size={20} /> : <Wand2 size={20} />}
                    Magic Generate
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {avatars.map((avatar: any) => (
                  <motion.div 
                    layout
                    key={avatar._id} 
                    className="group relative flex flex-col items-center bg-slate-50 p-4 rounded-3xl border border-slate-100 hover:border-[#2E7D32]/30 transition-all"
                  >
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white mb-3 shadow-inner group-hover:scale-105 transition-transform">
                      <img src={avatar.url} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter truncate w-24">
                        {avatar.name}
                      </p>
                    </div>
                    <button 
                      onClick={() => deleteAvatarMutation.mutate(avatar._id)}
                      className="absolute -top-2 -right-2 p-2 bg-white rounded-xl text-red-500 opacity-0 group-hover:opacity-100 shadow-lg border border-red-50/50 hover:bg-red-50 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "config" && (
            <div className="max-w-4xl">
              <form onSubmit={handleSaveConfig} className="space-y-12">
                <section className="space-y-8">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-[#2E7D32]/10 text-[#2E7D32] rounded-2xl flex items-center justify-center">
                        <Globe size={24} />
                     </div>
                     <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Merchant Section Content</h2>
                        <p className="text-slate-500 font-medium text-sm">Control the primary business conversion block</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 gap-8 bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Main Headline</label>
                      <input 
                        name="title"
                        type="text" 
                        defaultValue={config?.merchantSection?.title}
                        className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-100 focus:ring-4 focus:ring-[#2E7D32]/10 focus:border-[#2E7D32] font-black text-slate-800 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Description Text</label>
                      <textarea 
                        name="description"
                        rows={4}
                        defaultValue={config?.merchantSection?.description}
                        className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-100 focus:ring-4 focus:ring-[#2E7D32]/10 focus:border-[#2E7D32] font-medium text-slate-600 transition-all"
                      />
                    </div>
                  </div>
                </section>

                <div className="flex justify-end pt-4">
                  <button 
                    type="submit"
                    disabled={updateConfigMutation.isPending}
                    className="btn bg-[#2E7D32] hover:bg-[#1E5AA8] text-white border-none rounded-2xl font-black px-12 h-16 shadow-xl shadow-[#2E7D32]/20 disabled:opacity-50"
                  >
                    {updateConfigMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Save Configuration
                  </button>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Modals */}
      <BannerModal 
        isOpen={modalState.type === "banners"}
        onClose={() => setModalState({ type: null, data: null })}
        onSubmit={handleModalSubmit}
        initialData={modalState.data}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
      <ServiceModal 
        isOpen={modalState.type === "services"}
        onClose={() => setModalState({ type: null, data: null })}
        onSubmit={handleModalSubmit}
        initialData={modalState.data}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
      <ProcessStepModal 
        isOpen={modalState.type === "processSteps"}
        onClose={() => setModalState({ type: null, data: null })}
        onSubmit={handleModalSubmit}
        initialData={modalState.data}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
      <FeatureModal 
        isOpen={modalState.type === "features"}
        onClose={() => setModalState({ type: null, data: null })}
        onSubmit={handleModalSubmit}
        initialData={modalState.data}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default LandingPageManager;
