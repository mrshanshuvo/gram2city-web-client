"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

import { FiStar, FiX } from "react-icons/fi";
import { createReview } from "../../../features/riders/api";

import { Parcel } from "../../../features/parcels/types";

interface ReviewModalProps {
  parcel: Parcel;
  onClose: () => void;
  onSuccess: () => void;
}

const ReviewModal = ({ parcel, onClose, onSuccess }: ReviewModalProps) => {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: Record<string, string | number>) => {
    const reviewData = {
      parcel_id: parcel._id,
      user_email: parcel.created_by || undefined,
      user_name: parcel.senderName, // or current user name
      rider_email: parcel.assigned_rider_email || undefined,
      rider_name: parcel.assigned_rider_name || undefined,
      rating: rating,
      comment: data.comment as string,
    };

    try {
      const dataRes = await createReview(reviewData);
      if (dataRes.success) {
        Swal.fire({
          title: "Feedback Saved!",
          text: "Thank you for your review. It helps us improve!",
          icon: "success",
          confirmButtonColor: "#3B82F6",
        });
        onSuccess();
        onClose();
      }
    } catch {
      Swal.fire({
        title: "Error!",
        text: "Failed to submit review.",
        icon: "error",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#1E5AA8]/20 backdrop-blur-md">
      <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl relative overflow-hidden border border-slate-100">
        {/* Decorative Header */}
        <div className="bg-slate-50/50 px-10 py-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#2E7D32]" />
          <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            Rate Your Delivery
          </h3>
          <p className="text-slate-500 font-medium text-sm">
            How was your experience with{" "}
            <span className="text-[#2E7D32] font-bold">
              {parcel.assigned_rider_name}
            </span>
            ?
          </p>

          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-10 pb-10 space-y-8"
        >
          <div className="flex flex-col items-center gap-4">
            {/* Star Rating */}
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`text-5xl transition-all hover:scale-110 active:scale-95 ${
                    star <= (hover || rating)
                      ? "text-[#F4C20D]"
                      : "text-slate-100"
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                >
                  <FiStar
                    fill={star <= (hover || rating) ? "currentColor" : "none"}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>
            <div className="px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {rating === 1
                  ? "Poor"
                  : rating === 2
                    ? "Fair"
                    : rating === 3
                      ? "Good"
                      : rating === 4
                        ? "Very Good"
                        : "Exceptional"}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">
              Share your feedback
            </label>
            <textarea
              {...register("comment")}
              className="w-full h-32 bg-slate-50 border-2 border-slate-50 rounded-2xl p-6 focus:bg-white focus:border-[#2E7D32]/20 focus:ring-0 transition-all text-slate-700 font-medium placeholder:text-slate-300 resize-none"
              placeholder="What went well? Any areas for improvement?"
            ></textarea>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              Skip
            </button>
            <button
              type="submit"
              className="flex-[2] py-4 bg-[#2E7D32] hover:bg-[#1E5AA8] text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-[#2E7D32]/10 transition-all transform active:scale-95"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
