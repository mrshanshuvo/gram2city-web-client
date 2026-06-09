"use client";

import { useState } from "react";
import {
  useForm,
  UseFormRegister,
  RegisterOptions,
  FieldError,
} from "react-hook-form";
import {
  FiChevronDown,
  FiPhone,
  FiCreditCard,
  FiMapPin,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiShield,
  FiCompass,
  FiUser,
  FiMail,
  FiFileText,
  FiCalendar,
} from "react-icons/fi";
import Swal from "sweetalert2";
import { useAuthStore } from "@/features/auth/authStore";
import { axiosSecure } from "@/api/axios";
import { Area } from "@/features/parcels/types";
import { useQuery } from "@tanstack/react-query";
import { fetchWarehouses } from "@/features/landing/api";
import { queryKeys } from "@/lib/queryKeys";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  riderApplicationSchema,
  RiderApplicationFormValues,
} from "@/features/users/schema";

interface CustomSelectProps {
  children: React.ReactNode;
  register: UseFormRegister<RiderApplicationFormValues>;
  name: keyof RiderApplicationFormValues;
  options?: RegisterOptions<
    RiderApplicationFormValues,
    keyof RiderApplicationFormValues
  >;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: FieldError;
  icon?: React.ReactNode;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  children,
  register,
  name,
  options,
  onChange,
  error,
  icon,
}) => {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </span>
      )}
      <select
        {...register(name, options)}
        onChange={onChange}
        className={`w-full p-3 ${icon ? "pl-10" : "pl-3"} pr-10 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none bg-white text-slate-700 font-medium text-sm`}
      >
        {children}
      </select>
      <FiChevronDown className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
      {error && (
        <p className="mt-1 text-xs text-red-600 font-medium">{error.message}</p>
      )}
    </div>
  );
};

const BeARider = () => {
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<RiderApplicationFormValues>({
    resolver: zodResolver(riderApplicationSchema),
    mode: "onChange",
  });

  const { data: serviceCenters = [] } = useQuery<Area[]>({
    queryKey: queryKeys.landing.warehouses(),
    queryFn: fetchWarehouses,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Organize regions and their districts
  const regionsData = (serviceCenters as Area[]).reduce<
    Record<string, string[]>
  >((acc, area) => {
    if (!acc[area.region]) acc[area.region] = [];
    if (!acc[area.region].includes(area.district))
      acc[area.region].push(area.district);
    return acc;
  }, {});

  const regions = Object.keys(regionsData);
  const selectedRegion = watch("region");

  const onSubmit = async (data: RiderApplicationFormValues) => {
    if (!user) return;
    setIsSubmitting(true);

    const applicationData = {
      ...data,
      email: user.email,
      name: user.displayName,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await axiosSecure.post("/riders", applicationData);
      if (res.data?.insertedId) {
        Swal.fire({
          title: "Application Submitted!",
          text: "Your rider request is under review.",
          icon: "success",
          confirmButtonText: "Okay",
          confirmButtonColor: "#2563eb",
        });
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to submit your application";
      Swal.fire("Error", errorMessage, "error");
    }

    setIsSubmitting(false);
  };

  const nextStep = async () => {
    let fieldsToValidate: Array<keyof RiderApplicationFormValues> = [];
    if (currentStep === 1) {
      fieldsToValidate = ["phone", "age", "nid"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["bikeBrand", "bikeRegNo"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Onboarding Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl shadow-blue-100">
            <h2 className="text-2xl font-bold mb-6">Why deliver with us?</h2>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="p-3 bg-white/10 rounded-xl">
                  <FiClock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Flexible Schedule</h3>
                  <p className="text-blue-100 text-sm mt-1">
                    Be your own boss and set your own delivery hours.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-white/10 rounded-xl">
                  <FiDollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Competitive Payouts</h3>
                  <p className="text-blue-100 text-sm mt-1">
                    Get paid regularly with competitive rates per parcel.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-3 bg-white/10 rounded-xl">
                  <FiShield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Safe & Supported</h3>
                  <p className="text-blue-100 text-sm mt-1">
                    Dedicated team coordinates, plans routes, and keeps you
                    safe.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">
              Required Documents
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-slate-600 text-sm">
                <FiCheckCircle className="text-green-500 w-5 h-5 shrink-0" />
                <span>Valid Bangladeshi NID Card</span>
              </li>
              <li className="flex items-center gap-3 text-slate-600 text-sm">
                <FiCheckCircle className="text-green-500 w-5 h-5 shrink-0" />
                <span>Active Mobile Phone Number</span>
              </li>
              <li className="flex items-center gap-3 text-slate-600 text-sm">
                <FiCheckCircle className="text-green-500 w-5 h-5 shrink-0" />
                <span>Registered Motorcycle or Bicycle</span>
              </li>
              <li className="flex items-center gap-3 text-slate-600 text-sm">
                <FiCheckCircle className="text-green-500 w-5 h-5 shrink-0" />
                <span>Minimum Age of 18 Years</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side: Form Wizard */}
        <div className="lg:col-span-7 space-y-6">
          {/* Progress / Step Indicator */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex justify-between items-center relative overflow-hidden">
            {/* Step Line Background */}
            <div className="absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
            {/* Active Line Fill */}
            <div
              className="absolute top-1/2 left-[15%] h-0.5 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-300 ease-in-out"
              style={{ width: `${(currentStep - 1) * 35}%` }}
            ></div>

            {/* Step 1 */}
            <button
              type="button"
              onClick={() => currentStep > 1 && setCurrentStep(1)}
              className="z-10 flex flex-col items-center gap-1 group cursor-pointer focus:outline-none"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  currentStep >= 1
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                1
              </div>
              <span
                className={`text-[10px] sm:text-xs font-semibold ${currentStep >= 1 ? "text-blue-600" : "text-slate-400"}`}
              >
                Personal
              </span>
            </button>

            {/* Step 2 */}
            <button
              type="button"
              onClick={async () => {
                if (currentStep > 2) setCurrentStep(2);
                else if (currentStep === 1) await nextStep();
              }}
              className="z-10 flex flex-col items-center gap-1 group cursor-pointer focus:outline-none"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  currentStep >= 2
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                2
              </div>
              <span
                className={`text-[10px] sm:text-xs font-semibold ${currentStep >= 2 ? "text-blue-600" : "text-slate-400"}`}
              >
                Vehicle
              </span>
            </button>

            {/* Step 3 */}
            <button
              type="button"
              onClick={async () => {
                if (currentStep === 1) {
                  const isValid1 = await trigger(["phone", "age", "nid"]);
                  if (isValid1) {
                    const isValid2 = await trigger(["bikeBrand", "bikeRegNo"]);
                    if (isValid2) setCurrentStep(3);
                  }
                } else if (currentStep === 2) {
                  await nextStep();
                }
              }}
              className="z-10 flex flex-col items-center gap-1 group cursor-pointer focus:outline-none"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  currentStep === 3
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                3
              </div>
              <span
                className={`text-[10px] sm:text-xs font-semibold ${currentStep === 3 ? "text-blue-600" : "text-slate-400"}`}
              >
                Coverage
              </span>
            </button>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/40 min-h-95 flex flex-col justify-between"
          >
            <div>
              {/* STEP 1: PERSONAL INFORMATION */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-3 mb-2">
                    <h3 className="text-lg font-bold text-slate-800">
                      1. Account & Personal Info
                    </h3>
                    <p className="text-slate-400 text-xs">
                      Verify your profile information and enter personal
                      credentials.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                        Full Name
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <FiUser />
                        </span>
                        <input
                          type="text"
                          value={user?.displayName || ""}
                          readOnly
                          className="w-full p-3 pl-10 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed text-sm font-medium focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <FiMail />
                        </span>
                        <input
                          type="email"
                          value={user?.email || ""}
                          readOnly
                          className="w-full p-3 pl-10 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed text-sm font-medium focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                        Phone Number
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <FiPhone />
                        </span>
                        <input
                          type="tel"
                          {...register("phone")}
                          className={`w-full p-3 pl-10 border ${errors.phone ? "border-red-300 focus:ring-red-100" : "border-slate-200 focus:ring-blue-100"} rounded-lg focus:outline-none focus:ring-4 focus:border-blue-500 transition text-sm font-medium text-slate-700`}
                          placeholder="Enter 11-digit phone number"
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-600 font-medium">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                        Age
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <FiCalendar />
                        </span>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          {...register("age", {
                            valueAsNumber: true,
                            min: 18,
                            max: 70,
                          })}
                          className={`w-full p-3 pl-10 border ${errors.age ? "border-red-300 focus:ring-red-100" : "border-slate-200 focus:ring-blue-100"} rounded-lg focus:outline-none focus:ring-4 focus:border-blue-500 transition text-sm font-medium text-slate-700`}
                          placeholder="Your Age"
                        />
                      </div>
                      {errors.age && (
                        <p className="mt-1 text-xs text-red-600 font-medium">
                          {errors.age.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      NID Card Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FiCreditCard />
                      </span>
                      <input
                        type="text"
                        {...register("nid")}
                        className={`w-full p-3 pl-10 border ${errors.nid ? "border-red-300 focus:ring-red-100" : "border-slate-200 focus:ring-blue-100"} rounded-lg focus:outline-none focus:ring-4 focus:border-blue-500 transition text-sm font-medium text-slate-700`}
                        placeholder="Enter your 10, 13, or 17 digit NID"
                      />
                    </div>
                    {errors.nid && (
                      <p className="mt-1 text-xs text-red-600 font-medium">
                        {errors.nid.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: VEHICLE DETAILS */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-3 mb-2">
                    <h3 className="text-lg font-bold text-slate-800">
                      2. Vehicle Information
                    </h3>
                    <p className="text-slate-400 text-xs">
                      Enter your delivery vehicle details to confirm logistics
                      capacity.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                        Bike Brand
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <FiCompass />
                        </span>
                        <input
                          type="text"
                          {...register("bikeBrand")}
                          className={`w-full p-3 pl-10 border ${errors.bikeBrand ? "border-red-300 focus:ring-red-100" : "border-slate-200 focus:ring-blue-100"} rounded-lg focus:outline-none focus:ring-4 focus:border-blue-500 transition text-sm font-medium text-slate-700`}
                          placeholder="e.g. Yamaha, Honda, TVS, Bicycle"
                        />
                      </div>
                      {errors.bikeBrand && (
                        <p className="mt-1 text-xs text-red-600 font-medium">
                          {errors.bikeBrand.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                        Registration Number
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <FiFileText />
                        </span>
                        <input
                          type="text"
                          {...register("bikeRegNo")}
                          className={`w-full p-3 pl-10 border ${errors.bikeRegNo ? "border-red-300 focus:ring-red-100" : "border-slate-200 focus:ring-blue-100"} rounded-lg focus:outline-none focus:ring-4 focus:border-blue-500 transition text-sm font-medium text-slate-700`}
                          placeholder="e.g. DHAKA-METRO-HA-123456"
                        />
                      </div>
                      {errors.bikeRegNo && (
                        <p className="mt-1 text-xs text-red-600 font-medium">
                          {errors.bikeRegNo.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: COVERAGE AREA & EXTRA DETAILS */}
              {currentStep === 3 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-3 mb-2">
                    <h3 className="text-lg font-bold text-slate-800">
                      3. Service Area & Comments
                    </h3>
                    <p className="text-slate-400 text-xs">
                      Specify where you would like to pick up and deliver
                      packages.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                        Region
                      </label>
                      <CustomSelect
                        register={register}
                        name="region"
                        icon={<FiMapPin />}
                        onChange={(e) => {
                          setValue("region", e.target.value);
                          setValue("district", "");
                        }}
                        error={errors.region}
                      >
                        <option value="">Select region</option>
                        {regions.map((region) => (
                          <option key={region} value={region}>
                            {region}
                          </option>
                        ))}
                      </CustomSelect>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                        District
                      </label>
                      <CustomSelect
                        register={register}
                        name="district"
                        icon={<FiMapPin />}
                        error={errors.district}
                      >
                        <option value="">Select district</option>
                        {(regionsData[selectedRegion] || []).map(
                          (district: string) => (
                            <option key={district} value={district}>
                              {district}
                            </option>
                          ),
                        )}
                      </CustomSelect>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Extra Info / Previous Experience
                    </label>
                    <textarea
                      {...register("additionalInfo")}
                      className="w-full p-4 border border-slate-200 rounded-lg min-h-25 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition text-sm font-medium text-slate-700"
                      placeholder="e.g. Talk about your delivery experience or any other information you'd like to share"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Controls */}
            <div className="flex gap-4 border-t border-slate-100 pt-6 mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-1/3 py-3.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition cursor-pointer text-center text-sm"
                >
                  Back
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className={`py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition cursor-pointer text-center text-sm ${
                    currentStep === 1 ? "w-full" : "w-2/3"
                  }`}
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 cursor-pointer flex justify-center items-center gap-2 py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-100 transition disabled:opacity-75 text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

import Guard from "@/routes/PrivateRoute";

export default function Page() {
  return (
    <Guard>
      <BeARider />
    </Guard>
  );
}
