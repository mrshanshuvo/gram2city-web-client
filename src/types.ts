import { User as FirebaseUser, UserCredential } from "firebase/auth";

export interface User extends FirebaseUser {
  // Add custom properties if needed
  role?: "user" | "rider" | "admin";
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  createUser: (email: string, password: string) => Promise<UserCredential>;
  signInUser: (email: string, password: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  updateUserProfile: (profileInfo: { displayName?: string | null; photoURL?: string | null }) => Promise<void>;
  logOut: () => Promise<void>;
}

export interface UserInfoDB {
  email: string;
  name: string;
  photoURL: string | null;
  role: string;
  created_at: string;
  last_login: string;
}
