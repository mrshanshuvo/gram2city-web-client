import { useEffect } from "react";
import { auth } from "./firebase/firebase.init";
import { User } from "./features/auth/types";
import { useAuthStore } from "./features/auth/authStore";
import { useSocketStore } from "./store/useSocketStore";
import { axiosSecure } from "./api/axios";

const AuthInitializer = () => {
  const { setUser, setRole, setLoading } = useAuthStore();
  const { initializeSocket, disconnectSocket } = useSocketStore();

  useEffect(() => {
    // Initialize Socket
    initializeSocket();

    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      // Set basic user info first
      setUser(currentUser as User);

      if (currentUser) {
        try {
          const res = await axiosSecure.post("/users/sync");

          if (res.data?.success && res.data?.user) {
            setRole(res.data.user.role);
          }
        } catch (error) {
          console.error("Auth Initializer: Sync failed", error);
        }
      } else {
        setRole(null);
      }

      setLoading(false);
    });

    return () => {
      unsubscribe();
      disconnectSocket();
    };
  }, [setUser, setRole, setLoading, initializeSocket, disconnectSocket]);

  return null; // This component doesn't render anything
};

export default AuthInitializer;
