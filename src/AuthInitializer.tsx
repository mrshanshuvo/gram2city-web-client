import { useEffect } from "react";
import { auth } from "./firebase/firebase.init";
import { User } from "./features/auth/types";
import { useAuthStore } from "./features/auth/authStore";
import axios from "axios";

const AuthInitializer = () => {
  const { setUser, setRole, setLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      // Set basic user info first
      setUser(currentUser as User);

      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          // Sync with backend to get role and extra info
          const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/users/sync`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          if (res.data?.success && res.data?.user) {
            const enrichedUser = {
              ...currentUser,
              role: res.data.user.role,
            } as User;
            setUser(enrichedUser);
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

    return () => unsubscribe();
  }, [setUser, setRole, setLoading]);

  return null; // This component doesn't render anything
};

export default AuthInitializer;
