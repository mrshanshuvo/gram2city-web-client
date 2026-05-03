import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import useAuth from "../../../hooks/useAuth";
import { toast } from "react-toastify";
import { LoginFormData } from "../../../types";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { motion } from "framer-motion";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const { signInWithGoogle, signInUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || "/";
  const axiosSecure = useAxiosSecure();

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    if (!data.password) return;

    signInUser(data.email, data.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        toast.success(`Welcome back, ${user.displayName || "User"}!`);

        const userInfoDB = {
          email: user.email,
        };

        try {
          const token = await user.getIdToken();
          await axiosSecure.post("/users", userInfoDB, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (error) {
          console.error("Error updating user on login:", error);
        }

        navigate(from, { replace: true });
      })
      .catch((error: any) => {
        toast.error("Login failed: " + error.message);
        console.error("Login error:", error);
      });
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then(async (result) => {
        const user = result.user;

        toast.success("Google login successful!");
        console.log("Google login successful:", user);

        // Prepare user data to send to backend
        const userInfoDB = {
          email: user.email,
          name: user.displayName,
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
          Welcome Back
        </h1>
        <p className="text-gray-500 mt-2">Sign in to your ProFast account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
          <div className="flex items-center justify-between ml-1">
            <label className="text-xs font-semibold text-gray-600 uppercase">Password</label>
            <a href="#" className="text-[11px] font-bold text-[#A1C94F] hover:underline">
              Forgot?
            </a>
          </div>
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
          Sign In
        </motion.button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" state={{ from }} className="font-bold text-[#A1C94F] hover:underline transition-all">
            Create Account
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

export default Login;
