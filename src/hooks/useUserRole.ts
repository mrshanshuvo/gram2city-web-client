import useAuth from "./useAuth";

interface UseUserRoleReturn {
  role: string;
  roleLoading: boolean;
  error: Error | null;
}

const useUserRole = (): UseUserRoleReturn => {
  const { user, loading: authLoading } = useAuth();

  // The role is now synchronized in AuthProvider during the initial sync/onAuthStateChanged
  const role = user?.role || "user";

  return { 
    role, 
    roleLoading: authLoading, 
    error: null 
  };
};

export default useUserRole;
