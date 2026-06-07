"use client";

import { useState } from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layout,
  Image as ImageIcon,
  Plus,
  Trash2,
  Zap,
  UserCircle,
  Wand2,
  RefreshCcw,
  Loader2,
  Edit3,
  Star,
  MessageSquare,
  Building2,
  Quote,
  Globe,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import BannerModal from "./BannerModal";
import ServiceModal from "./ServiceModal";
import ProcessStepModal from "./ProcessStepModal";
import FeatureModal from "./FeatureModal";
import TestimonialModal from "./TestimonialModal";
import PartnerModal from "./PartnerModal";
import {
  fetchLandingData,
  fetchAvatars,
  fetchLandingConfig,
  createLandingItem,
  updateLandingItem,
  deleteLandingItem,
  updateLandingConfig,
  generateAvatars,
  deleteAvatar,
} from "@/features/landing/api";
import {
  Banner,
  Service,
  Feature,
  Testimonial,
  Partner,
  ProcessStep,
  LandingConfig,
  LandingItem,
  Avatar,
} from "@/features/landing/types";

const LandingPageManager = () => {
  const [activeTab, setActiveTab] = useState("banners");
  const [modalState, setModalState] = useState<{
    type: string | null;
    data: LandingItem | null;
  }>({ type: null, data: null });
  const queryClient = useQueryClient();

  // ─── DATA FETCHING ──────────────────────────────────────────────────────────

  const { data: banners = [], isLoading: bannersLoading } = useQuery({
    queryKey: ["admin-banners"],
    queryFn: () => fetchLandingData("banners"),
  });

  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: () => fetchLandingData("services"),
  });

  const { data: features = [], isLoading: featuresLoading } = useQuery({
    queryKey: ["admin-features"],
    queryFn: () => fetchLandingData("features"),
  });

  const { data: testimonials = [], isLoading: testimonialsLoading } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: () => fetchLandingData("testimonials"),
  });

  const { data: partners = [], isLoading: partnersLoading } = useQuery({
    queryKey: ["admin-partners"],
    queryFn: () => fetchLandingData("partners"),
  });

  const { data: avatars = [], isLoading: avatarsLoading } = useQuery<Avatar[]>({
    queryKey: ["admin-avatars"],
    queryFn: () => fetchAvatars(),
  });

  const { data: config, isLoading: configLoading } = useQuery({
    queryKey: ["admin-config"],
    queryFn: () => fetchLandingConfig(),
  });

  const { data: processSteps = [], isLoading: stepsLoading } = useQuery({
    queryKey: ["admin-process-steps"],
    queryFn: () => fetchLandingData("processSteps"),
  });

  // ─── MUTATIONS ──────────────────────────────────────────────────────────────

  const createMutation = useMutation({
    mutationFn: ({
      type,
      data,
    }: {
      type: string;
      data: FormData | LandingItem;
    }) => createLandingItem(type, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`admin-${variables.type}`] });
      toast.success(`${variables.type} created!`);
      setModalState({ type: null, data: null });
    },
    onError: (err: unknown) => {
      const errorMsg = err instanceof Error ? err.message : "Operation failed";
      toast.error(errorMsg);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      type,
      id,
      data,
    }: {
      type: string;
      id: string;
      data: FormData | LandingItem;
    }) => updateLandingItem(type, id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`admin-${variables.type}`] });
      toast.success(`${variables.type} updated!`);
      setModalState({ type: null, data: null });
    },
    onError: (err: unknown) => {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Update failed";
      toast.error(errorMessage);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ type, id }: { type: string; id: string }) =>
      deleteLandingItem(type, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`admin-${variables.type}`] });
      toast.success("Item removed.");
    },
  });

  const updateConfigMutation = useMutation({
    mutationFn: (newData: LandingConfig) => updateLandingConfig(newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-config"] });
      toast.success("Configuration saved!");
    },
  });

  const generateAvatarsMutation = useMutation({
    mutationFn: () => generateAvatars(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-avatars"] });
      toast.success("12 New avatars generated!");
    },
  });

  const deleteAvatarMutation = useMutation({
    mutationFn: (id: string) => deleteAvatar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-avatars"] });
      toast.success("Avatar removed.");
    },
  });

  // ─── HANDLERS ──────────────────────────────────────────────────────────────

  const handleModalSubmit = (data: FormData | LandingItem) => {
    if (modalState.data) {
      updateMutation.mutate({
        type: modalState.type!,
        id: (modalState.data as { _id?: string })._id as string,
        data,
      });
    } else {
      createMutation.mutate({ type: modalState.type!, data });
    }
  };

  const handleSaveConfig = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newData: LandingConfig = {
      merchantSection: {
        title: formData.get("title")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        benefits:
          formData
            .get("benefits")
            ?.toString()
            .split(",")
            .map((b) => b.trim()) ||
          config?.merchantSection?.benefits ||
          [],
        ctaText: formData.get("ctaText")?.toString() || "Become a Merchant",
        ctaLink: formData.get("ctaLink")?.toString() || "/register",
      },
      contactInfo: {
        address: formData.get("address")?.toString() || "",
        phone: formData.get("phone")?.toString() || "",
        whatsapp: formData.get("whatsapp")?.toString() || "",
        email: formData.get("email")?.toString() || "",
      },
      socialLinks: {
        twitter: formData.get("twitter")?.toString() || "",
        facebook: formData.get("facebook")?.toString() || "",
        linkedin: formData.get("linkedin")?.toString() || "",
        instagram: formData.get("instagram")?.toString() || "",
        youtube: formData.get("youtube")?.toString() || "",
      },
      seo: {
        title: formData.get("seoTitle")?.toString() || "",
        description: formData.get("seoDescription")?.toString() || "",
        keywords: formData.get("seoKeywords")?.toString() || "",
        image: formData.get("seoImage")?.toString() || "",
      },
    };
    updateConfigMutation.mutate(newData);
  };

  // ─── RENDER HELPERS ────────────────────────────────────────────────────────

  const TabButton = ({
    id,
    label,
    icon: Icon,
  }: {
    id: string;
    label: string;
    icon: React.ElementType;
  }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all ${
        activeTab === id
          ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
          : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
      }`}
    >
      <Icon size={20} />
      {label}
    </button>
  );

  const AddButton = ({
    label,
    onClick,
  }: {
    label: string;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className="btn bg-primary hover:bg-secondary text-white border-none rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-primary/20 px-6"
    >
      <Plus size={20} />
      {label}

    </button>
  );

  if (
    bannersLoading ||
    servicesLoading ||
    configLoading ||
    avatarsLoading ||
    stepsLoading ||
    featuresLoading ||
    testimonialsLoading ||
    partnersLoading
  ) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-[#2E7D32]" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Tabs */}
      <div className="flex flex-wrap gap-4 pb-4">
        <TabButton id="banners" label="Hero Banners" icon={ImageIcon} />
        <TabButton id="services" label="Services" icon={Zap} />
        <TabButton id="features" label="Features" icon={Star} />
        <TabButton
          id="testimonials"
          label="Testimonials"
          icon={MessageSquare}
        />
        <TabButton id="partners" label="Partners" icon={Building2} />
        <TabButton id="steps" label="Process Steps" icon={RefreshCcw} />
        <TabButton id="avatars" label="Avatars" icon={UserCircle} />
        <TabButton id="config" label="Config" icon={Layout} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm min-h-100"
        >
          {activeTab === "banners" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-900">
                  Banner Slides
                </h3>
                <AddButton
                  label="Add Banner"
                  onClick={() => setModalState({ type: "banners", data: null })}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {banners.map((banner: Banner) => (
                  <div
                    key={banner._id}
                    className="group relative bg-slate-50 rounded-3xl overflow-hidden border border-slate-200"
                  >
                    <div className="h-48 relative">
                      <Image
                        src={banner.image}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="w-full h-full object-cover"
                        alt={banner.title || ""}
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-3">
                        <button
                          onClick={() =>
                            setModalState({ type: "banners", data: banner })
                          }
                          className="p-3 bg-white rounded-full text-blue-500 hover:scale-110 transition-transform"
                        >
                          <Edit3 size={20} />
                        </button>
                        <button
                          onClick={() =>
                            deleteMutation.mutate({
                              type: "banners",
                              id: banner._id as string,
                            })
                          }
                          className="p-3 bg-white rounded-full text-red-500 hover:scale-110 transition-transform"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-black text-xl text-slate-900">
                        {banner.title || ""}
                      </h3>
                      <p className="text-slate-500 text-sm font-medium line-clamp-2 mt-2">
                        {banner.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "services" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-900">Services</h3>
                <AddButton
                  label="Add Service"
                  onClick={() =>
                    setModalState({ type: "services", data: null })
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {services.map((service: Service) => (
                  <div
                    key={service._id}
                    className="p-6 bg-slate-50 rounded-3xl border border-slate-200 flex flex-col gap-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#2E7D32] shadow-sm overflow-hidden p-2">
                        {service.image ? (
                          <Image
                            src={service.image}
                            alt=""
                            width={64}
                            height={64}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Zap size={24} />
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() =>
                            setModalState({ type: "services", data: service })
                          }
                          className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-blue-500"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() =>
                            deleteMutation.mutate({
                              type: "services",
                              id: service._id as string,
                            })
                          }
                          className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-red-500"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-slate-900">
                        {service.title || ""}
                      </h3>
                      <p className="text-slate-500 text-sm font-medium mt-1 line-clamp-2">
                        {service.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "features" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-900">Features</h3>
                <AddButton
                  label="Add Feature"
                  onClick={() =>
                    setModalState({ type: "features", data: null })
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {features.map((feature: Feature) => (
                  <div
                    key={feature._id}
                    className={`p-6 bg-slate-50 rounded-3xl border border-slate-200 flex flex-col gap-4 transition-all ${!feature.isActive ? "opacity-60 grayscale-[0.5]" : ""}`}
                  >
                    <div className="h-32 bg-white rounded-2xl overflow-hidden border border-slate-100 relative">
                      {!feature.isActive && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest rounded-lg z-20">
                          Hidden
                        </div>
                      )}
                      {feature.image && (
                        <Image
                          src={feature.image}
                          fill
                          sizes="(max-width: 768px) 100vw, 300px"
                          className="w-full h-full object-contain"
                          alt=""
                        />
                      )}
                    </div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-black text-lg text-slate-900">
                        {feature.title || ""}
                      </h3>
                      <div className="flex gap-1">
                        <button
                          onClick={() =>
                            setModalState({ type: "features", data: feature })
                          }
                          className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-blue-500"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() =>
                            deleteMutation.mutate({
                              type: "features",
                              id: feature._id as string,
                            })
                          }
                          className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-red-500"
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

          {activeTab === "testimonials" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-900">
                  Testimonials
                </h3>
                <AddButton
                  label="Add Quote"
                  onClick={() =>
                    setModalState({ type: "testimonials", data: null })
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map((t: Testimonial) => (
                  <div
                    key={t._id}
                    className={`p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 relative group transition-all ${!t.isActive ? "opacity-60 grayscale-[0.5]" : ""}`}
                  >
                    <div className="absolute top-8 right-8 text-slate-200 group-hover:text-[#2E7D32]/20 transition-colors">
                      <Quote size={40} />
                    </div>
                    {!t.isActive && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full z-20">
                        Hidden
                      </div>
                    )}
                    <div className="flex items-center gap-4 mb-6">
                      <Image
                        src={t.image}
                        width={56}
                        height={56}
                        className="w-14 h-14 rounded-2xl object-cover shadow-sm"
                        alt=""
                      />
                      <div>
                        <h4 className="font-black text-slate-900">
                          {t.name || ""}
                        </h4>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          {t.title || ""}
                        </p>
                      </div>
                    </div>
                    <p className="text-slate-600 font-medium italic mb-6 leading-relaxed">
                      "{t.quote}"
                    </p>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                      <div className="flex gap-1 text-[#F4C20D]">
                        {[...Array(t.rating || 5)].map((_, i) => (
                          <Star key={i} size={14} fill="currentColor" />
                        ))}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() =>
                            setModalState({ type: "testimonials", data: t })
                          }
                          className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-blue-500"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() =>
                            deleteMutation.mutate({
                              type: "testimonials",
                              id: t._id as string,
                            })
                          }
                          className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-red-500"
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

          {activeTab === "partners" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-900">
                  Partners & Clients
                </h3>
                <AddButton
                  label="Add Partner"
                  onClick={() =>
                    setModalState({ type: "partners", data: null })
                  }
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {partners.map((p: Partner) => (
                  <div
                    key={p._id}
                    className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center group relative"
                  >
                    <Image
                      src={p.logo}
                      width={120}
                      height={48}
                      className="h-12 w-auto object-contain"
                      alt={p.name || ""}
                    />
                    <p className="text-xs font-black text-slate-900 mt-4 tracking-tighter">
                      {p.name || ""}
                    </p>
                    <div className="absolute top-2 right-2 flex opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() =>
                          setModalState({ type: "partners", data: p })
                        }
                        className="p-1.5 hover:bg-white rounded-lg text-blue-500"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() =>
                          deleteMutation.mutate({
                            type: "partners",
                            id: p._id as string,
                          })
                        }
                        className="p-1.5 hover:bg-white rounded-lg text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "steps" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-900">
                  How it Works
                </h3>
                <AddButton
                  label="Add Step"
                  onClick={() =>
                    setModalState({ type: "processSteps", data: null })
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {processSteps.map((step: ProcessStep) => (
                  <div
                    key={step._id}
                    className="p-6 bg-slate-50 rounded-3xl border border-slate-200"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-black">
                        {step.order}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() =>
                            setModalState({ type: "processSteps", data: step })
                          }
                          className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-blue-500"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() =>
                            deleteMutation.mutate({
                              type: "processSteps",
                              id: step._id as string,
                            })
                          }
                          className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-red-500"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-black text-lg text-slate-900">
                      {step.title || ""}
                    </h3>
                    <p className="text-slate-500 text-sm font-medium mt-1">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "avatars" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    Avatar Vault
                  </h3>
                  <p className="text-slate-500 font-medium text-sm">
                    Magic generation for user profiles
                  </p>
                </div>
                <button
                  onClick={() => generateAvatarsMutation.mutate()}
                  className="btn bg-accent hover:bg-[#EBC00D] text-slate-900 rounded-2xl font-black gap-2"
                >
                  <Wand2 size={20} /> Magic Generate
                </button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
                {avatars.map((a) => (
                  <div
                    key={a._id}
                    className="relative group bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col items-center"
                  >
                    <Image
                      src={a.url}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-xl shadow-sm"
                      alt=""
                    />
                    <button
                      onClick={() => deleteAvatarMutation.mutate(a._id)}
                      className="absolute -top-2 -right-2 p-1.5 bg-white rounded-lg text-red-500 opacity-0 group-hover:opacity-100 shadow-md"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "config" && (
            <div className="max-w-4xl">
              <form onSubmit={handleSaveConfig} className="space-y-12">
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    <Layout className="text-[#2E7D32]" size={24} />
                    Merchant Section
                  </h2>
                  <div className="space-y-4 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                        Headline
                      </label>
                      <input
                        name="title"
                        defaultValue={config?.merchantSection?.title}
                        className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-4"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        rows={3}
                        defaultValue={config?.merchantSection?.description}
                        className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-4"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                          CTA Text
                        </label>
                        <input
                          name="ctaText"
                          defaultValue={config?.merchantSection?.ctaText}
                          className="w-full p-4 rounded-2xl border border-slate-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                          CTA Link
                        </label>
                        <input
                          name="ctaLink"
                          defaultValue={config?.merchantSection?.ctaLink}
                          className="w-full p-4 rounded-2xl border border-slate-200"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                        Benefits (Comma separated)
                      </label>
                      <input
                        name="benefits"
                        defaultValue={config?.merchantSection?.benefits?.join(
                          ", ",
                        )}
                        className="w-full p-4 rounded-2xl border border-slate-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    <Globe className="text-[#1E5AA8]" size={24} />
                    Contact Info
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                        Address
                      </label>
                      <input
                        name="address"
                        defaultValue={config?.contactInfo?.address}
                        className="w-full p-4 rounded-2xl border border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                        Phone
                      </label>
                      <input
                        name="phone"
                        defaultValue={config?.contactInfo?.phone}
                        className="w-full p-4 rounded-2xl border border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                        WhatsApp
                      </label>
                      <input
                        name="whatsapp"
                        defaultValue={config?.contactInfo?.whatsapp}
                        className="w-full p-4 rounded-2xl border border-slate-200"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                        Email
                      </label>
                      <input
                        name="email"
                        defaultValue={config?.contactInfo?.email}
                        className="w-full p-4 rounded-2xl border border-slate-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    <UserCircle className="text-[#F4C20D]" size={24} />
                    Social Media
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                    {[
                      "Twitter",
                      "Facebook",
                      "LinkedIn",
                      "Instagram",
                      "YouTube",
                    ].map((s) => (
                      <div key={s} className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                          {s}
                        </label>
                        <input
                          name={s.toLowerCase()}
                          defaultValue={config?.socialLinks?.[s.toLowerCase()]}
                          className="w-full p-4 rounded-2xl border border-slate-200"
                          placeholder={`https://${s.toLowerCase()}.com/...`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* SEO & Marketing */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                    <Zap className="text-[#F4C20D]" size={24} />
                    SEO & Social Marketing
                  </h2>
                  <div className="space-y-6 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                          SEO Title (Google)
                        </label>
                        <input
                          name="seoTitle"
                          defaultValue={config?.seo?.title}
                          className="w-full p-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary/10"
                          placeholder="e.g. Gram2City | Fastest Village to City Logistics"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                          SEO Keywords
                        </label>
                        <input
                          name="seoKeywords"
                          defaultValue={config?.seo?.keywords}
                          className="w-full p-4 rounded-2xl border border-slate-200"
                          placeholder="logistics, shipping, bangladesh, delivery"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                        Meta Description
                      </label>
                      <textarea
                        name="seoDescription"
                        rows={3}
                        defaultValue={config?.seo?.description}
                        className="w-full p-4 rounded-2xl border border-slate-200"
                        placeholder="Tell Google what your site is about..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                        OpenGraph Share Image (URL)
                      </label>
                      <input
                        name="seoImage"
                        defaultValue={config?.seo?.image}
                        className="w-full p-4 rounded-2xl border border-slate-200"
                        placeholder="https://your-site.com/share-image.jpg"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={updateConfigMutation.isPending}
                    className="px-12 py-5 bg-primary text-white rounded-2xl font-black shadow-xl flex items-center gap-2"
                  >
                    {updateConfigMutation.isPending ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <Save size={20} />
                    )}
                    Save All Settings
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
        initialData={modalState.data as Banner | undefined}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
      <ServiceModal
        isOpen={modalState.type === "services"}
        onClose={() => setModalState({ type: null, data: null })}
        onSubmit={handleModalSubmit}
        initialData={modalState.data as Service | undefined}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
      <ProcessStepModal
        isOpen={modalState.type === "processSteps"}
        onClose={() => setModalState({ type: null, data: null })}
        onSubmit={handleModalSubmit}
        initialData={modalState.data as ProcessStep | undefined}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
      <FeatureModal
        isOpen={modalState.type === "features"}
        onClose={() => setModalState({ type: null, data: null })}
        onSubmit={handleModalSubmit}
        initialData={modalState.data as Feature | undefined}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
      <TestimonialModal
        isOpen={modalState.type === "testimonials"}
        onClose={() => setModalState({ type: null, data: null })}
        onSubmit={handleModalSubmit}
        initialData={modalState.data as Testimonial | undefined}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
      <PartnerModal
        isOpen={modalState.type === "partners"}
        onClose={() => setModalState({ type: null, data: null })}
        onSubmit={handleModalSubmit}
        initialData={modalState.data as Partner | undefined}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default LandingPageManager;
