import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useAuthStore } from "../../../features/auth/authStore";
import {
  FiUsers,
  FiUserCheck,
  FiShield,
  FiSearch,
  FiDownload,
  FiStar,
  FiActivity,
  FiTrendingUp,
} from "react-icons/fi";
import Swal from "sweetalert2";
import moment from "moment";
import {
  fetchUsersSummary,
  fetchStaffList,
  searchUsers,
  updateUserRole,
} from "../../../features/users/api";

const MakeAdmins = () => {
  const SUPER_ADMIN_EMAIL = "shahidhasanshovu@gmail.com";
  const axiosSecure = useAxiosSecure();
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
    queryFn: () => fetchUsersSummary(axiosSecure),
  });

  // Fetch all staff by default
  const { data: staffList = [] } = useQuery({
    queryKey: ["staffList"],
    queryFn: () => fetchStaffList(axiosSecure),
  });

  // Search users
  const { data: matchedUsers = [] } = useQuery({
    queryKey: ["searchUsers", debouncedEmail],
    queryFn: () => searchUsers(axiosSecure, debouncedEmail),
    enabled: !!debouncedEmail,
  });

  const { mutate: updateRole, isPending: isUpdating } = useMutation({
    mutationFn: ({ email, role }: { email: string; role: string }) =>
      updateUserRole(axiosSecure, email, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["searchUsers"] });
      queryClient.invalidateQueries({ queryKey: ["staffList"] });
      queryClient.invalidateQueries({ queryKey: ["usersSummary"] });
      Swal.fire("Success!", "User role updated successfully.", "success");
    },
  });

  const downloadReport = () => {
    const headers = ["Name", "Email", "Role", "Last Login"];
    const rows = staffList.map(
      (s: {
        name?: string;
        email: string;
        role: string;
        last_login?: string;
      }) => [
        s.name || "N/A",
        s.email,
        s.role,
        s.last_login
          ? moment(s.last_login).format("YYYY-MM-DD HH:mm")
          : "Never",
      ],
    );

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
      <div className="flex justify-center p-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
            <FiShield className="text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">
              Staff Management
            </h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Role Hierarchy & Permissions
            </p>
          </div>
        </div>
        <button
          onClick={downloadReport}
          className="btn btn-sm bg-primary text-white border-none hover:bg-primary/90 shadow-lg shadow-primary/20 px-6 rounded-xl font-bold h-11"
        >
          <FiDownload className="mr-2" /> Download Staff Report
        </button>
      </div>

      {/* Main Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-indigo-100 transition-colors">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <FiStar className="text-xl" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Super Admins
            </p>
            <p className="text-2xl font-black text-gray-800">
              {summary?.superAdmin || 0}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-emerald-100 transition-colors">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <FiUserCheck className="text-xl" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Active Admins
            </p>
            <p className="text-2xl font-black text-gray-800">
              {summary?.admin || 0}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-blue-100 transition-colors">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <FiUsers className="text-xl" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Total Fleet
            </p>
            <p className="text-2xl font-black text-gray-800">
              {summary?.total || 0}
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-amber-100 transition-colors">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <FiActivity className="text-xl" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Active Today
            </p>
            <p className="text-2xl font-black text-gray-800">
              {summary?.activeToday || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Advanced Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden flex items-center justify-between">
          <div className="relative z-10">
            <h4 className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em] mb-2">
              Growth Velocity
            </h4>
            <p className="text-4xl font-black tracking-tighter">
              +{summary?.recentlyJoined || 0}
            </p>
            <p className="text-[10px] font-bold opacity-60 mt-2 uppercase tracking-widest">
              New Users this week
            </p>
          </div>
          <div className="w-24 h-24 bg-primary/20 rounded-full blur-2xl absolute -right-4 -top-4"></div>
          <FiTrendingUp className="text-6xl opacity-10 absolute right-8 bottom-8" />
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-center">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
                Staff Saturation
              </h4>
              <p className="text-xl font-black text-gray-800">
                {(
                  ((summary?.admin + summary?.superAdmin) /
                    (summary?.total || 1)) *
                  100
                ).toFixed(1)}
                %
              </p>
            </div>
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
              Ratio: 1 Staff /{" "}
              {Math.round(
                (summary?.total || 1) /
                  (summary?.admin + summary?.superAdmin || 1),
              )}{" "}
              Users
            </span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-1000"
              style={{
                width: `${((summary?.admin + summary?.superAdmin) / (summary?.total || 1)) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-primary transition-colors" />
        <input
          type="email"
          placeholder="Search users by email to grant or revoke admin access..."
          className="input w-full pl-14 h-16 bg-white border-gray-100 rounded-3xl shadow-sm focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <h3 className="text-sm font-black text-gray-800 uppercase tracking-tighter">
            {debouncedEmail ? "Search Results" : "Current Administrative Staff"}
          </h3>
          <span className="badge badge-primary badge-sm font-bold py-3 px-4">
            {displayUsers.length} Users
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-none">
                <th className="px-8 py-5">Staff Member</th>
                <th>Role Access</th>
                <th className="text-right px-8">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {displayUsers.map(
                (user: {
                  name?: string;
                  email: string;
                  role: string;
                  photoURL?: string;
                }) => (
                  <tr
                    key={user.email}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-gray-100 text-gray-400 rounded-xl w-10 h-10 font-bold text-xs">
                            {user.photoURL ? (
                              <img src={user.photoURL} alt="User" />
                            ) : (
                              (user.name?.[0] || user.email[0]).toUpperCase()
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="font-black text-gray-800 text-sm">
                            {user.name || "Anonymous User"}
                          </div>
                          <div className="text-[10px] text-gray-400 font-bold font-mono tracking-tighter">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {user.role === "superAdmin" ? (
                        <span className="badge badge-sm border-none bg-indigo-50 text-indigo-600 font-black uppercase text-[9px] tracking-widest py-3 px-4">
                          Super Admin
                        </span>
                      ) : user.role === "admin" ? (
                        <span className="badge badge-sm border-none bg-emerald-50 text-emerald-600 font-black uppercase text-[9px] tracking-widest py-3 px-4">
                          Platform Admin
                        </span>
                      ) : (
                        <span className="badge badge-sm border-none bg-gray-50 text-gray-400 font-black uppercase text-[9px] tracking-widest py-3 px-4">
                          Standard User
                        </span>
                      )}
                    </td>
                    <td className="text-right px-8">
                      {user.email === SUPER_ADMIN_EMAIL ? (
                        <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest flex items-center justify-end gap-2">
                          <FiShield /> System Owner
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          {user.role === "admin" ? (
                            <button
                              disabled={isUpdating}
                              onClick={() => {
                                Swal.fire({
                                  title: "Revoke Access?",
                                  text: "User will lose all administrative privileges.",
                                  icon: "warning",
                                  showCancelButton: true,
                                  confirmButtonText: "Yes, Revoke",
                                  confirmButtonColor: "#EF4444",
                                }).then((res) => {
                                  if (res.isConfirmed)
                                    updateRole({
                                      email: user.email,
                                      role: "user",
                                    });
                                });
                              }}
                              className="btn btn-xs bg-red-50 text-red-600 border-none hover:bg-red-100 font-black uppercase tracking-tight"
                            >
                              Revoke
                            </button>
                          ) : (
                            <button
                              disabled={isUpdating}
                              onClick={() => {
                                Swal.fire({
                                  title: "Promote to Admin?",
                                  text: "User will gain full dashboard access.",
                                  icon: "info",
                                  showCancelButton: true,
                                  confirmButtonText: "Yes, Promote",
                                  confirmButtonColor: "#10B981",
                                }).then((res) => {
                                  if (res.isConfirmed)
                                    updateRole({
                                      email: user.email,
                                      role: "admin",
                                    });
                                });
                              }}
                              className="btn btn-xs bg-emerald-50 text-emerald-600 border-none hover:bg-emerald-100 font-black uppercase tracking-tight"
                            >
                              Grant Admin
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
          {displayUsers.length === 0 && (
            <div className="p-10 text-center space-y-3">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                <FiUsers className="text-2xl" />
              </div>
              <p className="text-gray-400 font-bold text-sm tracking-tight">
                No staff members found matching your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MakeAdmins;
