"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import {
  FiChevronLeft,
  FiChevronRight,
  FiUsers,
  FiClock,
  FiSearch,
} from "react-icons/fi";
import Swal from "sweetalert2";
import { fetchRidersByStatus, updateRiderStatus } from "@/features/riders/api";
import { Rider } from "@/features/riders/types";

const RiderManagement = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"approved" | "pending">(
    "approved",
  );
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery<{
    data: Rider[];
    pagination: {
      totalItems: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }>({
    queryKey: ["riders", activeTab, page, size],
    queryFn: () => fetchRidersByStatus(activeTab, { page, size }),
  });

  const riders = data?.data || [];
  const pagination = data?.pagination || {
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };
  const totalPages = pagination.totalPages;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const startRange = (page - 1) * size + 1;
  const endRange = Math.min(page * size, pagination.totalItems);

  const handleDecision = async (
    id: string,
    decision: "approved" | "rejected" | "inactive",
    email?: string,
  ) => {
    const isApproving = decision === "approved";
    const isSuspending = decision === "inactive";
    let title = "Are you sure?";
    let text = "Confirm this action";
    let confirmColor = "#3085d6";

    if (isApproving) {
      title = "Approve Rider Application?";
      text = "This will elevate the user to an active rider.";
      confirmColor = "#10b981";
    } else if (isSuspending) {
      title = "Suspend Rider?";
      text =
        "This rider will no longer be able to log in or access the system.";
      confirmColor = "#ef4444";
    } else {
      title = "Reject Rider Application?";
      text = "This application will be marked as rejected.";
      confirmColor = "#ef4444";
    }

    Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: confirmColor,
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, proceed!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const dataRes = await updateRiderStatus(id, decision, email);
          if (dataRes.modifiedCount > 0) {
            Swal.fire(
              "Success!",
              `Rider status updated to ${decision}.`,
              "success",
            );
            queryClient.invalidateQueries({ queryKey: ["riders"] });
          }
        } catch (err: unknown) {
          const errorMessage =
            err instanceof Error ? err.message : "An unknown error occurred";
          Swal.fire("Error!", errorMessage, "error");
        }
      }
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(parseISO(dateString), "PPpp");
    } catch {
      return "N/A";
    }
  };

  const filteredRiders = riders.filter(
    (rider) =>
      (rider.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rider.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rider.phone || "").includes(searchTerm),
  );

  const downloadCSV = () => {
    if (filteredRiders.length === 0) return;

    const headers = [
      "Rider Name",
      "Phone",
      "Email",
      "Vehicle",
      "Reg No",
      "District",
      "Status",
    ];
    const rows = filteredRiders.map((r) => [
      r.name || "Unknown",
      r.phone || "",
      r.email || "",
      r.bikeBrand || "",
      r.bikeRegNo || "",
      r.district || "",
      r.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `gram2city_riders_report_${activeTab}_${new Date().getTime()}.csv`,
    );
    link.click();
  };

  if (isLoading)
    return (
      <div className="text-center py-12">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  if (error)
    return <div className="alert alert-error">Error loading riders</div>;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Rider Console
          </h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">
            Manage your fleet workforce and applications
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          {/* Tab Selection */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => {
                setActiveTab("approved");
                setPage(1);
                setSearchTerm("");
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === "approved"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <FiUsers /> Active Fleet
            </button>
            <button
              onClick={() => {
                setActiveTab("pending");
                setPage(1);
                setSearchTerm("");
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === "pending"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <FiClock /> Pending Applications
            </button>
          </div>

          <button
            onClick={downloadCSV}
            className="btn btn-sm bg-primary border-none hover:bg-primary/95 text-white shadow-lg shadow-primary/20 h-11 px-5 rounded-2xl text-xs font-black uppercase tracking-wider"
          >
            Export CSV
          </button>

          <div className="dropdown dropdown-bottom">
            <div
              tabIndex={0}
              role="button"
              className="btn bg-white hover:bg-slate-50 border border-gray-100 text-slate-700 font-bold text-xs flex items-center gap-2 px-4 h-11 min-h-0 rounded-2xl shadow-sm"
            >
              <span className="textarea-sm text-slate-400 font-black uppercase tracking-widest">
                Rows:
              </span>
              <span>{size}</span>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-white text-slate-800 rounded-2xl z-20 w-24 p-1.5 mt-1 shadow-xl border border-slate-100"
            >
              {[10, 15, 20].map((val) => (
                <li key={val}>
                  <button
                    type="button"
                    onClick={() => {
                      setSize(val);
                      setPage(1);
                      if (document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur();
                      }
                    }}
                    className={`text-xs font-bold text-center justify-center rounded-lg py-2 hover:bg-slate-100 ${
                      size === val
                        ? "bg-primary/10 text-primary"
                        : "text-slate-700"
                    }`}
                  >
                    {val}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              className="bg-white border border-slate-200 w-full sm:w-72 h-11 pl-10 pr-4 rounded-2xl text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          </div>
        </div>
      </div>

      {filteredRiders.length === 0 ? (
        <div className="alert alert-info bg-blue-50 border-blue-100 text-blue-700 rounded-3xl p-6 font-bold text-center">
          {searchTerm
            ? "No matching records found."
            : `No ${activeTab} riders at the moment.`}
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 uppercase text-[9px] font-black tracking-widest border-b border-slate-100">
                  <th className="py-5 px-6">Rider Info</th>
                  <th>Contact Info</th>
                  <th>Vehicle Details</th>
                  <th>Location</th>
                  <th>Application State</th>
                  <th className="text-right px-8">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredRiders.map((rider) => (
                  <tr
                    key={rider._id}
                    className="hover:bg-slate-50/20 transition-colors"
                  >
                    <td className="py-5 px-6">
                      <div className="font-black text-slate-800 text-sm">
                        {rider.name || "Unknown"}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                        NID: {rider.nid || "N/A"}
                      </div>
                    </td>
                    <td>
                      <div className="font-semibold text-slate-700 text-xs">
                        {rider.phone}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono tracking-tighter mt-0.5">
                        {rider.email || "N/A"}
                      </div>
                    </td>
                    <td>
                      <div className="font-bold text-slate-700 text-xs">
                        {rider.bikeBrand || "N/A"}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                        {rider.bikeRegNo || "N/A"}
                      </div>
                    </td>
                    <td>
                      <div className="text-xs font-semibold text-slate-600">
                        {rider.district}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                        {rider.region}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider inline-block ${
                          rider.status === "approved"
                            ? "bg-emerald-50 text-emerald-600"
                            : rider.status === "pending"
                              ? "bg-amber-50 text-amber-600 animate-pulse"
                              : "bg-rose-50 text-rose-600"
                        }`}
                      >
                        {rider.status}
                      </span>
                    </td>
                    <td className="text-right px-8">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedRider(rider);
                            setIsModalOpen(true);
                          }}
                          className="btn btn-xs bg-slate-100 hover:bg-slate-200 border-none text-slate-600 font-black rounded-lg px-3.5 h-8"
                        >
                          Review Details
                        </button>
                        {activeTab === "pending" ? (
                          <>
                            <button
                              onClick={() =>
                                handleDecision(
                                  rider._id,
                                  "approved",
                                  rider.email,
                                )
                              }
                              className="btn btn-xs bg-emerald-500 hover:bg-emerald-600 border-none text-white font-black rounded-lg px-4 h-8"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleDecision(
                                  rider._id,
                                  "rejected",
                                  rider.email,
                                )
                              }
                              className="btn btn-xs bg-rose-500 hover:bg-rose-600 border-none text-white font-black rounded-lg px-4 h-8"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() =>
                              handleDecision(rider._id, "inactive", rider.email)
                            }
                            className="btn btn-xs bg-rose-50 hover:bg-rose-100 border-none text-rose-600 font-black rounded-lg px-4 h-8"
                          >
                            Suspend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Smart Pagination Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 bg-slate-50/50 border-t border-slate-100 gap-4">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Showing{" "}
              <span className="text-slate-800 font-black">{startRange}</span> to{" "}
              <span className="text-slate-800 font-black">{endRange}</span> of{" "}
              <span className="text-slate-800 font-black">
                {pagination.totalItems}
              </span>{" "}
              Riders
            </div>

            <div className="flex items-center gap-2">
              <button
                className="btn btn-sm bg-white border-none shadow-sm hover:bg-primary hover:text-white transition-all text-gray-400"
                onClick={() => handlePageChange(page - 1)}
                disabled={!pagination.hasPrevPage}
              >
                <FiChevronLeft />
              </button>

              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= page - 1 && pageNum <= page + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`btn btn-sm w-9 h-9 min-h-0 border-none shadow-sm transition-all text-xs font-bold ${
                          page === pageNum
                            ? "bg-primary text-white"
                            : "bg-white text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (pageNum === page - 2 || pageNum === page + 2) {
                    return (
                      <span
                        key={pageNum}
                        className="text-gray-300 font-bold px-1"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                className="btn btn-sm bg-white border-none shadow-sm hover:bg-primary hover:text-white transition-all text-gray-400"
                onClick={() => handlePageChange(page + 1)}
                disabled={!pagination.hasNextPage}
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unified Rider Details Modal */}
      <dialog className={`modal ${isModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box max-w-2xl rounded-3xl p-8 shadow-2xl relative border border-slate-100 bg-white">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-5">
            Rider Profile: {selectedRider?.name || "Unknown"}
          </h3>

          {selectedRider && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    Personal Information
                  </p>
                  <div className="space-y-1.5 text-slate-700 text-sm">
                    <p>
                      <strong>Name:</strong> {selectedRider.name || "Unknown"}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedRider.email || "N/A"}
                    </p>
                    <p>
                      <strong>Phone:</strong> {selectedRider.phone}
                    </p>
                    <p>
                      <strong>Age:</strong> {selectedRider.age}
                    </p>
                    <p>
                      <strong>NID:</strong> {selectedRider.nid}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    Location & Status
                  </p>
                  <div className="space-y-1.5 text-slate-700 text-sm">
                    <p>
                      <strong>Region:</strong> {selectedRider.region}
                    </p>
                    <p>
                      <strong>District:</strong> {selectedRider.district}
                    </p>
                    <p>
                      <strong>Current Status:</strong>{" "}
                      <span className="font-bold text-primary uppercase">
                        {selectedRider.status}
                      </span>
                    </p>
                    <p>
                      <strong>Applied On:</strong>{" "}
                      {formatDate(selectedRider.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  Vehicle Information
                </p>
                <div className="space-y-1.5 text-slate-700 text-sm">
                  <p>
                    <strong>Brand / Model:</strong>{" "}
                    {selectedRider.bikeBrand || "N/A"}
                  </p>
                  <p>
                    <strong>Registration Number:</strong>{" "}
                    {selectedRider.bikeRegNo || "N/A"}
                  </p>
                </div>
              </div>

              {selectedRider.additionalInfo && (
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    Additional Information
                  </p>
                  <p className="text-slate-600 text-sm whitespace-pre-line leading-relaxed">
                    {selectedRider.additionalInfo}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="modal-action mt-8 flex justify-end gap-3">
            {selectedRider?.status === "pending" ? (
              <>
                <button
                  className="btn bg-emerald-500 hover:bg-emerald-600 border-none text-white font-black px-6 rounded-xl"
                  onClick={() => {
                    if (selectedRider) {
                      handleDecision(
                        selectedRider._id,
                        "approved",
                        selectedRider.email,
                      );
                    }
                    setIsModalOpen(false);
                  }}
                >
                  Approve Application
                </button>
                <button
                  className="btn bg-rose-500 hover:bg-rose-600 border-none text-white font-black px-6 rounded-xl"
                  onClick={() => {
                    if (selectedRider) {
                      handleDecision(
                        selectedRider._id,
                        "rejected",
                        selectedRider.email,
                      );
                    }
                    setIsModalOpen(false);
                  }}
                >
                  Reject Application
                </button>
              </>
            ) : (
              <button
                className="btn bg-rose-500 hover:bg-rose-600 border-none text-white font-black px-6 rounded-xl"
                onClick={() => {
                  if (selectedRider) {
                    handleDecision(
                      selectedRider._id,
                      "inactive",
                      selectedRider.email,
                    );
                  }
                  setIsModalOpen(false);
                }}
              >
                Suspend Rider
              </button>
            )}
            <button
              className="btn border border-slate-200 hover:bg-slate-50 bg-white text-slate-600 rounded-xl"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default RiderManagement;
