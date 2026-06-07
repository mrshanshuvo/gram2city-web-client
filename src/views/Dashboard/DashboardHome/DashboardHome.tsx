import { useAuthStore } from "../../../features/auth/authStore";
import AdminDashboard from "./AdminDashboard";
import RiderDashboard from "./RiderDashboard";
import UserDashboard from "./UserDashboard";
import MerchantDashboard from "./MerchantDashboard";
import AvatarRevealModal from "../../../components/Dashboard/AvatarRevealModal";
import { usePageHeader } from "../../../hooks/usePageHeader";

const DashboardHome = () => {
  const { user, role: storedRole, isLoading: roleLoading } = useAuthStore();
  const role = storedRole || user?.role || "user";

  usePageHeader(
    `Welcome, ${user?.displayName || "User"}`,
    "Your logistics overview at a glance",
  );

  if (roleLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <progress className="progress progress-primary w-56"></progress>
      </div>
    );
  }

  if (!role) {
    return <div>Unauthorized or no role assigned.</div>;
  }

  return (
    <>
      <AvatarRevealModal />
      {role === "admin" && <AdminDashboard />}
      {role === "rider" && <RiderDashboard />}
      {role === "merchant" && <MerchantDashboard />}
      {role === "user" && <UserDashboard />}
    </>
  );
};

export default DashboardHome;
