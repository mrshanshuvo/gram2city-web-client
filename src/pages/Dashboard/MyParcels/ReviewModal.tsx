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
        icon: "error"
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden transition-all scale-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-blue-600 px-6 py-4 flex justify-between items-center text-white">
          <h3 className="text-xl font-bold">Rate Your Experience</h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <FiX className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <p className="text-gray-600 font-medium">How was your delivery by <span className="text-primary font-bold">{parcel.assigned_rider_name}</span>?</p>

            {/* Star Rating */}
            <div className="flex justify-center gap-2 py-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`text-4xl transition-all ${star <= (hover || rating) ? "text-yellow-400 scale-110" : "text-gray-300"
                    }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                >
                  <FiStar fill={star <= (hover || rating) ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
            <p className="text-sm font-semibold text-primary">{rating} out of 5 stars</p>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">Detailed Feedback (Optional)</span>
            </label>
            <textarea
              {...register("comment")}
              className="textarea textarea-bordered h-32 w-full focus:ring-2 focus:ring-primary/20 transition-all text-base"
              placeholder="What went well? Any areas of improvement?"
            ></textarea>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost flex-1 border border-gray-200"
            >
              Skip for Now
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1 shadow-lg shadow-primary/30"
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
