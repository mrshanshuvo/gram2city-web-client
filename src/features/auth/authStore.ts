import { create } from "zustand";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase/firebase.init";
import { User } from "./types";

const googleProvider = new GoogleAuthProvider();

interface AuthState {
  user: User | null;
  role: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setRole: (role: string | null) => void;
  setLoading: (loading: boolean) => void;

  // Actions
  createUser: (email: string, password: string) => Promise<any>;
  signInUser: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  updateUserProfile: (profileInfo: {
    displayName?: string | null;
    photoURL?: string | null;
  }) => Promise<any>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  setLoading: (loading) => set({ isLoading: loading }),

  createUser: (email, password) => {
    set({ isLoading: true });
    return createUserWithEmailAndPassword(auth, email, password);
  },

  signInUser: (email, password) => {
    set({ isLoading: true });
    return signInWithEmailAndPassword(auth, email, password);
  },

  signInWithGoogle: () => {
    set({ isLoading: true });
    return signInWithPopup(auth, googleProvider);
  },

  updateUserProfile: (profileInfo) => {
    if (!auth.currentUser) return Promise.reject("No user logged in");
    return updateProfile(auth.currentUser, profileInfo);
  },

  logout: async () => {
    set({ isLoading: true });
    await signOut(auth);
    set({ user: null, role: null, isLoading: false });
  },
}));
