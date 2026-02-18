import { api } from "@/lib/api";
import { Role } from "@/store/useRoleStore";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  studentId?: string;
  phoneNumber?: string;
  address?: string;
  role?: Role;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: Role;
      blocked?: boolean;
      roomId?: string;
    };
  };
}

export interface ProfileResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    email: string;
    role: Role;
    blocked?: boolean;
    roomId?: string;
  };
}

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post("/api/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post("/api/auth/register", data);
    return response.data;
  },

  getProfile: async (): Promise<ProfileResponse> => {
    const response = await api.get("/api/auth/me");
    return response.data;
  },
};
