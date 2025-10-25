import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "student" | "admin" | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  studentId?: string;
  department?: string;
  avatar?: string;
}

interface RoleState {
  role: Role;
  user: User | null;
  setRole: (role: Role, user?: User) => void;
  logout: () => void;
}

export const useRoleStore = create<RoleState>()(
  persist(
    (set) => ({
      role: null,
      user: null,
      setRole: (role, user) => set({ role, user: user || null }),
      logout: () => set({ role: null, user: null }),
    }),
    {
      name: "hall-management-auth",
    }
  )
);
