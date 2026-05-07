import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { axiosSecure } from "../../../api/axios";
import { useAuthStore } from "../../../features/auth/authStore";
import { toast } from "sonner";
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Camera,
  Save,
  Loader2,
  ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileFormValues } from "../../../features/auth/schema";

const UpdateProfile = () => {
  const { user, updateUserProfile } = useAuthStore();

  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

  const { data: dbUser, isLoading: userLoading } = useQuery({
    queryKey: ["db-user", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (dbUser) {
      setValue("name", dbUser.name);
      setValue("photoURL", dbUser.photoURL);
      setValue("phone", dbUser.phone);
      setValue("address", dbUser.address);
    }
  }, [dbUser, setValue]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setSaving(true);
      
      // 1. Update Firebase Profile
      await updateUserProfile({
        displayName: data.name,
        photoURL: data.photoURL,
      });

      // 2. Update MongoDB
      const res = await axiosSecure.patch(`/users/${user?.email}`, {
        name: data.name,
        photoURL: data.photoURL,
        phone: data.phone,
        address: data.address
      });

      if (res.data.success) {
        queryClient.invalidateQueries({ queryKey: ["db-user"] });
        toast.success("Profile updated successfully!");
        if (res.data.isProfileComplete) {
          toast.success("Congratulations! You are now a Verified Shipper.");
        }
      }
    } catch (error: unknown) {
      toast.error("Failed to update profile: " + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-[#2E7D32]" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Identity Settings</h1>
          <p className="text-slate-500 font-medium mt-1">Personalize your shipping persona and contact info</p>
        </div>
        {dbUser?.isProfileComplete && (
           <div className="flex items-center gap-2 px-4 py-2 bg-[#2E7D32]/10 text-[#2E7D32] rounded-2xl border border-[#2E7D32]/20 shadow-sm">
             <ShieldCheck size={20} />
             <span className="font-black uppercase tracking-widest text-xs">Verified Shipper</span>
           </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Avatar Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm text-center">
            <div className="relative inline-block group">
              <div className="w-40 h-40 rounded-[3rem] overflow-hidden border-8 border-slate-50 shadow-inner group-hover:scale-105 transition-transform duration-500">
                <img
                  src={user?.photoURL || "https://i.ibb.co/bc9S6Pz/user.png"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="absolute -bottom-2 -right-2 p-3 bg-[#2E7D32] text-white rounded-2xl shadow-xl border-4 border-white cursor-pointer hover:scale-110 transition-transform">
                <Camera size={20} />
                <input type="file" className="hidden" />
              </label>
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-black text-slate-900">{user?.displayName}</h3>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">User Account</p>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-50 flex justify-center gap-4">
               <div className="text-center">
                 <p className="text-xl font-black text-slate-900">{dbUser?.isProfileComplete ? "100%" : "66%"}</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Status</p>
               </div>
               <div className="w-px h-10 bg-slate-100" />
               <div className="text-center">
                 <p className="text-xl font-black text-slate-900">Elite</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Tier</p>
               </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Info Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#2E7D32] transition-colors" size={18} />
                    <input
                      type="text"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2E7D32]/10 focus:border-[#2E7D32] transition-all font-bold text-slate-700"
                      {...register("name")}
                    />
                  </div>
                  {errors.name && <span className="text-xs text-red-500 font-bold ml-1">{(errors.name.message as string)}</span>}
                </div>

                {/* Email (Read Only) */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative group opacity-60">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                      type="email"
                      value={user?.email || ""}
                      readOnly
                      className="w-full pl-12 pr-4 py-4 bg-slate-100 border border-slate-200 rounded-2xl cursor-not-allowed font-bold text-slate-500"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#2E7D32] transition-colors" size={18} />
                    <input
                      type="tel"
                      placeholder="+880 1XXX-XXXXXX"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2E7D32]/10 focus:border-[#2E7D32] transition-all font-bold text-slate-700"
                      {...register("phone")}
                    />
                  </div>
                </div>

                {/* Photo URL */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Avatar URL</label>
                  <div className="relative group">
                    <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#2E7D32] transition-colors" size={18} />
                    <input
                      type="url"
                      placeholder="https://..."
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2E7D32]/10 focus:border-[#2E7D32] transition-all font-bold text-slate-700"
                      {...register("photoURL")}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Pickup Address</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-6 text-slate-300 group-focus-within:text-[#2E7D32] transition-colors" size={18} />
                    <textarea
                      placeholder="Enter your detailed address for logistics team..."
                      rows={4}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2E7D32]/10 focus:border-[#2E7D32] transition-all font-bold text-slate-700"
                      {...register("address")}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn bg-[#2E7D32] hover:bg-[#1E5AA8] text-white border-none rounded-2xl font-black px-12 h-14 shadow-xl shadow-[#2E7D32]/20 transition-all flex items-center gap-2 disabled:opacity-70"
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  Save Identity
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UpdateProfile;
