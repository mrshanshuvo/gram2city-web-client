import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

interface RoleData {
  role?: string;
}

interface UseUserRoleReturn {
  role: string;
  roleLoading: boolean;
  error: Error | null;
}

const useUserRole = (): UseUserRoleReturn => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: roleData,
    isLoading: roleLoading,
    error,
  } = useQuery<RoleData, Error>({
    queryKey: ["userRole", user?.email],
    queryFn: async () => {
      if (!user?.email) throw new Error("User email not found");
      const res = await axiosSecure.get(`/users/${user.email}/role`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const role = roleData?.role || "user";

  return { 
    role, 
    roleLoading: authLoading || roleLoading, 
    error: error as Error | null 
  };
};

export default useUserRole;
