import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FiUser, FiMail, FiPhone, FiMapPin, FiCamera } from "react-icons/fi";

const UpdateProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    if (user) {
      setValue("name", user.displayName);
      setValue("photoURL", user.photoURL);
    }
  }, [user, setValue]);

  const onSubmit = async (data) => {
    try {
      // 1. Update Firebase Profile
      await updateUserProfile(data.name, data.photoURL);

      // 2. Update MongoDB
      const res = await axiosSecure.patch(`/users/${user.email}`, {
        name: data.name,
        photoURL: data.photoURL,
        phone: data.phone,
        address: data.address
      });

      if (res.data.success) {
        Swal.fire({
          title: "Profile Updated!",
          text: "Your profile has been updated successfully.",
          icon: "success",
          confirmButtonColor: "#3B82F6",
        });
      }
      // eslint-disable-next-line no-unused-vars
    } catch (saveError) {
      Swal.fire({
        title: "Error!",
        text: "Failed to update profile. Please try again.",
        icon: "error"
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-blue-600 p-8 text-white">
          <h2 className="text-3xl font-bold">Account Settings</h2>
          <p className="mt-2 opacity-90">Manage your profile information and preferences</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Profile Picture Section */}
            <div className="md:col-span-2 flex flex-col items-center mb-4">
              <div className="relative group">
                <img
                  src={user?.photoURL || "https://i.ibb.co/bc9S6Pz/user.png"}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow-lg"
                />
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <FiCamera className="text-white text-2xl" />
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500 font-medium">Click to update your avatar</p>
            </div>

            {/* Name */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <FiUser className="text-primary" /> Full Name
                </span>
              </label>
              <input
                type="text"
                placeholder="Ex: John Doe"
                className={`input input-bordered w-full focus:ring-2 focus:ring-primary/20 ${errors.name ? 'border-red-500' : ''}`}
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && <span className="text-xs text-red-500 mt-1">{errors.name.message}</span>}
            </div>

            {/* Email (Read Only) */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <FiMail className="text-primary" /> Email Address
                </span>
              </label>
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="input input-bordered w-full bg-gray-50 cursor-not-allowed opacity-70"
              />
            </div>

            {/* Phone */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <FiPhone className="text-primary" /> Phone Number
                </span>
              </label>
              <input
                type="tel"
                placeholder="Ex: +8801700000000"
                className="input input-bordered w-full focus:ring-2 focus:ring-primary/20"
                {...register("phone")}
              />
            </div>

            {/* Photo URL */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <FiCamera className="text-primary" /> Photo URL
                </span>
              </label>
              <input
                type="url"
                placeholder="https://example.com/photo.jpg"
                className="input input-bordered w-full focus:ring-2 focus:ring-primary/20"
                {...register("photoURL")}
              />
            </div>

            {/* Address */}
            <div className="form-control w-full md:col-span-2">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <FiMapPin className="text-primary" /> Address
                </span>
              </label>
              <textarea
                placeholder="Your permanent address..."
                className="textarea textarea-bordered w-full min-h-[100px] focus:ring-2 focus:ring-primary/20"
                {...register("address")}
              ></textarea>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              className="btn btn-primary px-10 h-12 text-lg shadow-lg hover:shadow-primary/30 transition-all border-none"
            >
              Save All Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
