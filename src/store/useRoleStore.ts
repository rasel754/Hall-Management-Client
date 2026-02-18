import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "student" | "admin" | null;

interface User {
  id: string;
  _id?: string; // Fallback for raw Mongo ID
  name: string;
  email: string;
  role: Role;
  studentId?: string;
  department?: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  roomId?: string;
}

interface RoleState {
  role: Role;
  user: User | null;
  token: string | null;
  setRole: (role: Role, user?: User) => void;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useRoleStore = create<RoleState>()(
  persist(
    (set) => ({
      role: null,
      user: null,
      token: null,
      setRole: (role, user) => set({ role, user: user || null }),
      setAuth: (token, user) => {
        if (!token || token === "undefined") {
          console.error("❌ Attempted to store INVALID token:", token);
          return;
        }

        localStorage.setItem("token", token);
        set({ token, user, role: user.role });
      },
      logout: () => {
        localStorage.removeItem("token");
        set({ role: null, user: null, token: null });
      },
    }),
    {
      name: "hall-management-auth",
    }
  )
);
