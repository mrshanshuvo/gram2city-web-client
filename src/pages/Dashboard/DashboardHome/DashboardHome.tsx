import useUserRole from "../../../hooks/useUserRole";
import AdminDashboard from "./AdminDashboard";
import RiderDashboard from "./RiderDashboard";
import UserDashboard from "./UserDashboard";
import AvatarRevealModal from "../../../components/Dashboard/AvatarRevealModal";

const DashboardHome = () => {
  const { role, roleLoading } = useUserRole();

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
      {role === "user" && <UserDashboard />}
    </>
  );
};

export default DashboardHome;
