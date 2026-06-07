"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../../features/auth/authStore";
import {
  FiUsers,
  FiUserCheck,
  FiSearch,
  FiDownload,
  FiStar,
  FiActivity,
  FiLock,
  FiUnlock,
} from "react-icons/fi";
import Swal from "sweetalert2";
import moment from "moment";
import {
  fetchUsersSummary,
  fetchStaffList,
  searchUsers,
  updateUserRole,
  updateUserStatus,
} from "../../../features/users/api";
import { usePageHeader } from "../../../hooks/usePageHeader";

const MakeAdmins = () => {
  const SUPER_ADMIN_EMAIL = "shahidhasanshovu@gmail.com";
  usePageHeader(
    "User & Staff Authority",
    "Global account management and role hierarchy",
  );

  const queryClient = useQueryClient();
  const { isLoading: authLoading } = useAuthStore();

  const [searchText, setSearchText] = useState("");
  const [debouncedEmail, setDebouncedEmail] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedEmail(searchText.trim());
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchText]);

  // Summary Stats
  const { data: summary } = useQuery({
    queryKey: ["usersSummary"],
    queryFn: () => fetchUsersSummary(),
  });

  // Fetch all staff by default
  const { data: staffList = [] } = useQuery({
    queryKey: ["staffList"],
    queryFn: () => fetchStaffList(),
  });

  // Search users
  const { data: matchedUsers = [] } = useQuery({
    queryKey: ["searchUsers", debouncedEmail],
    queryFn: () => searchUsers(debouncedEmail),
    enabled: !!debouncedEmail,
  });

  const { mutate: mutateRole } = useMutation({
    mutationFn: ({ email, role }: { email: string; role: string }) =>
      updateUserRole(email, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["searchUsers"] });
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
      queryClient.invalidateQueries({ queryKey: ["usersSummary"] });
      Swal.fire("Success!", "User role updated successfully.", "success");
    },
  });

  const { mutate: mutateStatus } = useMutation({
    mutationFn: ({ email, status }: { email: string; status: string }) =>
      updateUserStatus(email, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["searchUsers"] });
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
      Swal.fire("Updated!", "Account status has been changed.", "success");
    },
  });

  const downloadReport = () => {
    const headers = ["Name", "Email", "Role", "Status", "Last Login"];
    const rows = staffList.map((s: any) => [
      s.displayName || s.name || "N/A",
      s.email,
      s.role,
      s.status || "active",
      s.last_login ? moment(s.last_login).format("YYYY-MM-DD HH:mm") : "Never",
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
      `staff_report_${moment().format("YYYYMMDD")}.csv`,
    );
    link.click();
  };

  const displayUsers = debouncedEmail ? matchedUsers : staffList;

  if (authLoading)
    return (
      <div className="p-20 text-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-end">
        <button
          onClick={downloadReport}
          className="btn btn-sm bg-[#1E5AA8] text-white border-none hover:bg-blue-700 shadow-lg shadow-blue-500/20 px-8 rounded-xl font-black uppercase tracking-widest h-11"
        >
          <FiDownload className="mr-2" /> Export Staff Directory
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Super Admins",
            count: summary?.superAdmin,
            icon: FiStar,
            color: "indigo",
          },
          {
            label: "Platform Staff",
            count: summary?.admin,
            icon: FiUserCheck,
            color: "emerald",
          },
          {
            label: "Total Fleet",
            count: summary?.total,
            icon: FiUsers,
            color: "blue",
          },
          {
            label: "Active Today",
            count: summary?.activeToday,
            icon: FiActivity,
            color: "amber",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-xl transition-all"
          >
            <div
              className={`w-12 h-12 bg-${card.color}-50 text-${card.color}-600 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}
            >
              <card.icon />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {card.label}
              </p>
              <p className="text-2xl font-black text-slate-800">
                {card.count || 0}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-[#1E5AA8] transition-colors" />
        <input
          type="email"
          placeholder="Lookup user by email to manage authority..."
          className="input w-full pl-16 h-20 bg-white border-slate-100 rounded-[2.5rem] shadow-sm focus:ring-8 focus:ring-blue-500/5 transition-all text-sm font-black"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
            {debouncedEmail ? "Search Results" : "Platform Authority List"}
          </h3>
          <span className="px-4 py-1.5 bg-[#1E5AA8] text-white text-[10px] font-black rounded-full uppercase tracking-widest">
            {displayUsers.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-none">
                <th className="px-10 py-6">Identity</th>
                <th>Privilege Level</th>
                <th>Status</th>
                <th className="text-right px-10">Authority Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {displayUsers.map((user: any) => (
                <tr
                  key={user.email}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="avatar placeholder">
                        <div className="bg-slate-100 text-slate-400 rounded-2xl w-12 h-12 font-black text-sm">
                          {user.photoURL ? (
                            <img src={user.photoURL} alt="User" />
                          ) : (
                            (
                              user.displayName?.[0] ||
                              user.name?.[0] ||
                              user.email[0]
                            ).toUpperCase()
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="font-black text-slate-800 text-sm">
                          {user.displayName || user.name || "Anonymous User"}
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold font-mono">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col gap-1">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest w-fit ${
                          user.role === "superAdmin"
                            ? "bg-indigo-50 text-indigo-600"
                            : user.role === "admin"
                              ? "bg-emerald-50 text-emerald-600"
                              : user.role === "merchant"
                                ? "bg-purple-50 text-purple-600"
                                : user.role === "rider"
                                  ? "bg-amber-50 text-amber-600"
                                  : "bg-slate-50 text-slate-400"
                        }`}
                      >
                        {user.role || "User"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${
                        user.status === "suspended"
                          ? "text-red-500"
                          : "text-emerald-500"
                      }`}
                    >
                      {user.status === "suspended" ? <FiLock /> : <FiUnlock />}
                      {user.status || "active"}
                    </span>
                  </td>
                  <td className="text-right px-10 space-x-2">
                    {user.email !== SUPER_ADMIN_EMAIL && (
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Status Toggle */}
                        <button
                          onClick={() => {
                            const newStatus =
                              user.status === "suspended"
                                ? "active"
                                : "suspended";
                            Swal.fire({
                              title: `${newStatus === "suspended" ? "Suspend" : "Activate"} Account?`,
                              text: `This will ${newStatus === "suspended" ? "block" : "restore"} platform access.`,
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonText: `Yes, ${newStatus}`,
                              confirmButtonColor:
                                newStatus === "suspended"
                                  ? "#EF4444"
                                  : "#10B981",
                            }).then((res) => {
                              if (res.isConfirmed)
                                mutateStatus({
                                  email: user.email,
                                  status: newStatus,
                                });
                            });
                          }}
                          className={`btn btn-xs border-none font-black uppercase tracking-tight rounded-lg ${
                            user.status === "suspended"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {user.status === "suspended" ? "Activate" : "Suspend"}
                        </button>

                        {/* Role Change */}
                        <select
                          className="select select-xs select-ghost bg-slate-50 font-black uppercase text-[9px] tracking-tight rounded-lg"
                          value={user.role || "user"}
                          onChange={(e) => {
                            const newRole = e.target.value;
                            Swal.fire({
                              title: "Change Authority?",
                              text: `Update user privilege to ${newRole}?`,
                              icon: "info",
                              showCancelButton: true,
                              confirmButtonText: "Confirm",
                            }).then((res) => {
                              if (res.isConfirmed)
                                mutateRole({
                                  email: user.email,
                                  role: newRole,
                                });
                            });
                          }}
                        >
                          <option value="user">User</option>
                          <option value="rider">Rider</option>
                          <option value="merchant">Merchant</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {displayUsers.length === 0 && (
            <div className="py-20 text-center text-slate-300 italic font-bold">
              No authority records match your search criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MakeAdmins;
