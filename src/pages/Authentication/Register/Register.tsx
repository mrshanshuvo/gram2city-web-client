import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import axios from "axios";
import React, { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { UserInfoDB, RegisterFormData } from "../../../types";
import { motion } from "framer-motion";
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed, HiOutlineCloudUpload } from "react-icons/hi";

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
      // 1. Create user in Firebase
      const userCredential = await createUser(data.email, data.password);
      toast.success("User registered successfully!");

      const token = await userCredential.user.getIdToken();
      let finalPhotoURL = null;

      // 2. Upload image to backend if selected
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

      // 3. Prepare the user info object for DB
      const userInfoDB: UserInfoDB = {
        email: data.email,
        name: data.name,
        photoURL: finalPhotoURL,
      };

      // 4. Send to backend DB
      const res = await axiosSecure.post("/users", userInfoDB, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("User stored in DB:", res.data);

      // 5. Update Firebase user profile
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
      .then(async (result) => {
        const user = result.user;

        toast.success("Google login successful!");
        console.log("Google login successful:", user);

        // Prepare user data to send to backend
        const userInfoDB: UserInfoDB = {
          email: user.email!,
          name: user.displayName!,
          photoURL: user.photoURL,
        };

        try {
          // Send to your backend to save in MongoDB
          const token = await user.getIdToken();
          const res = await axiosSecure.post("/users", userInfoDB, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("User saved or already exists:", res.data);
        } catch (error: any) {
          toast.error("Error saving user info: " + error.message);
          console.error("Error saving user:", error);
        }

        navigate("/dashboard");
      })
      .catch((error: any) => {
        toast.error("Google sign-in failed: " + error.message);
        console.error("Google sign-in error:", error);
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Create an Account
        </h1>
        <p className="text-gray-500 mt-2">Join ProFast and start delivering</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Image Upload */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <label className="relative cursor-pointer group">
            <div className={`w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden transition-all group-hover:border-[#CAEB66] ${previewUrl ? 'border-solid border-[#CAEB66]' : ''}`}>
              {previewUrl ? (
                <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <HiOutlineCloudUpload className={`w-8 h-8 ${uploading ? 'animate-bounce text-[#CAEB66]' : 'text-gray-400'}`} />
              )}
            </div>
            <input
              type="file"
              id="image"
              onChange={handleImageUpload}
              className="hidden"
            />
            {!previewUrl && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-2 text-[10px] text-gray-500 border border-gray-200 rounded-full shadow-sm whitespace-nowrap group-hover:text-[#A1C94F]">
                {uploading ? "Uploading..." : "Upload Photo"}
              </span>
            )}
          </label>
        </div>

        {/* Name */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-600 uppercase ml-1">Full Name</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#A1C94F] transition-colors">
              <HiOutlineUser className="w-5 h-5" />
            </div>
            <input
              type="text"
              {...register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "Name must be at least 2 characters" },
              })}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]/50 focus:border-[#CAEB66] transition-all"
              placeholder="John Doe"
            />
          </div>
          {errors.name && <p className="text-[11px] text-red-500 ml-1">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-600 uppercase ml-1">Email Address</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#A1C94F] transition-colors">
              <HiOutlineMail className="w-5 h-5" />
            </div>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]/50 focus:border-[#CAEB66] transition-all"
              placeholder="john@example.com"
            />
          </div>
          {errors.email && <p className="text-[11px] text-red-500 ml-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-600 uppercase ml-1">Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#A1C94F] transition-colors">
              <HiOutlineLockClosed className="w-5 h-5" />
            </div>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]/50 focus:border-[#CAEB66] transition-all"
              placeholder="••••••••"
            />
          </div>
          {errors.password && <p className="text-[11px] text-red-500 ml-1">{errors.password.message}</p>}
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-3 px-4 bg-[#CAEB66] hover:bg-[#BDE44B] text-gray-900 font-bold rounded-xl shadow-lg shadow-[#CAEB66]/20 transition-all cursor-pointer mt-2"
        >
          Create Account
        </motion.button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-[#A1C94F] hover:underline transition-all">
            Log In
          </Link>
        </p>
      </div>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-2 bg-white text-gray-400 font-medium">Or continue with</span>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGoogleSignIn}
        type="button"
        className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all cursor-pointer shadow-sm"
      >
        <FcGoogle className="w-5 h-5 mr-3" />
        <span className="text-sm font-semibold text-gray-700">Google Account</span>
      </motion.button>
    </motion.div>
  );
};

export default Register;
