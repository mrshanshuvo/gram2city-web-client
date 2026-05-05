import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import { toast } from "react-toastify";
import React, { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { UserInfoDB, RegisterFormData } from "../../../types";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Lock, 
  Camera, 
  ArrowRight,
  Loader2
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";

const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const navigate = useNavigate();
  const { createUser, signInWithGoogle, updateUserProfile } = useAuth();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const axiosSecure = useAxiosSecure();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || "/";

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    if (!data.password) return;

    try {
      setUploading(true);
      const userCredential = await createUser(data.email, data.password);
      toast.success("User registered successfully!");

      const token = await userCredential.user.getIdToken();
      let finalPhotoURL = null;

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        try {
          const uploadRes = await axiosSecure.post("/upload", formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });
          finalPhotoURL = uploadRes.data.url;
        } catch (error: any) {
          console.error("Image upload failed:", error);
          toast.warning("Account created, but image upload failed.");
        }
      }

      const userInfoDB: UserInfoDB = {
        email: data.email,
        name: data.name,
        photoURL: finalPhotoURL,
      };

      const res = await axiosSecure.post("/users", userInfoDB, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("User stored in DB:", res.data);

      const userInfo = {
        displayName: data.name,
        photoURL: finalPhotoURL,
      };

      await updateUserProfile(userInfo);
      toast.success("Profile fully updated!");

      navigate(from, { replace: true });
    } catch (error: any) {
      toast.error("Registration failed: " + error.message);
      console.error("Registration error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then(() => {
        toast.success("Google login successful!");
        navigate("/dashboard");
      })
      .catch((error: any) => {
        toast.error("Google sign-in failed: " + error.message);
        console.error("Google sign-in error:", error);
      });
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center lg:text-left">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black text-slate-900 tracking-tight mb-2"
        >
          Join Gram2City
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-slate-500 font-medium"
        >
          Create an account and start shipping today
        </motion.p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Profile Photo Upload */}
        <div className="flex justify-center lg:justify-start mb-8">
          <label className="relative cursor-pointer group">
            <div className={`w-28 h-28 rounded-3xl border-4 border-slate-100 flex items-center justify-center overflow-hidden transition-all group-hover:border-[#2E7D32] bg-slate-50 shadow-inner ${previewUrl ? 'border-[#2E7D32]' : ''}`}>
              <AnimatePresence mode="wait">
                {previewUrl ? (
                  <motion.img 
                    key="preview"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    src={previewUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <motion.div 
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-1"
                  >
                    <Camera className="w-8 h-8 text-slate-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Photo</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <input
              type="file"
              id="image"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg border border-slate-100 group-hover:bg-[#2E7D32] group-hover:text-white transition-all">
              <Camera size={16} />
            </div>
          </label>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2E7D32] transition-colors" size={20} />
            <input
              type="text"
              {...register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "Minimum 2 characters" },
              })}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2E7D32]/10 focus:border-[#2E7D32] transition-all font-medium"
              placeholder="Your full name"
            />
          </div>
          {errors.name && <p className="text-xs text-red-500 font-bold ml-1 animate-pulse">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2E7D32] transition-colors" size={20} />
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2E7D32]/10 focus:border-[#2E7D32] transition-all font-medium"
              placeholder="name@example.com"
            />
          </div>
          {errors.email && <p className="text-xs text-red-500 font-bold ml-1 animate-pulse">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2E7D32] transition-colors" size={20} />
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#2E7D32]/10 focus:border-[#2E7D32] transition-all font-medium"
              placeholder="••••••••"
            />
          </div>
          {errors.password && <p className="text-xs text-red-500 font-bold ml-1 animate-pulse">{errors.password.message}</p>}
        </div>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          disabled={uploading}
          type="submit"
          className="w-full py-4 px-6 bg-[#2E7D32] hover:bg-[#1E5AA8] text-white font-black rounded-2xl shadow-xl shadow-[#2E7D32]/20 transition-all cursor-pointer flex items-center justify-center gap-2 group disabled:opacity-70"
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Processing...
            </>
          ) : (
            <>
              Create Account
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </motion.button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-slate-500 font-medium">
          Already have an account?{" "}
          <Link to="/login" className="font-black text-[#2E7D32] hover:text-[#1E5AA8] transition-all underline underline-offset-4">
            Log In
          </Link>
        </p>
      </div>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-100"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest font-black text-slate-400">
          <span className="px-4 bg-white">Or join with</span>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02, backgroundColor: "#f8fafc" }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGoogleSignIn}
        type="button"
        className="w-full flex justify-center items-center py-4 px-6 border-2 border-slate-100 rounded-2xl bg-white transition-all cursor-pointer shadow-sm hover:border-slate-200"
      >
        <FcGoogle className="w-6 h-6 mr-3" />
        <span className="text-sm font-bold text-slate-700">Google Account</span>
      </motion.button>
    </div>
  );
};

export default Register;
