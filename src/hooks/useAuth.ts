import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService, LoginRequest, RegisterRequest } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { extractErrorMessage } from "@/lib/api";

export const useAuth = () => {
  const { user, token, role, setAuth, logout: storeLogout } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      if (response.success) {
        const { token: tokenData, user: userData } = response.data;
        setAuth(tokenData, userData);
        toast.success(`Welcome back, ${userData.name}!`);
        navigate(userData.role === "student" ? "/dashboard/student/overview" : "/dashboard/admin/overview");
      }
    },
    onError: (error: any) => {
      toast.error(extractErrorMessage(error));
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (response) => {
      if (response.success) {
        const { token: tokenData, user: userData } = response.data;
        setAuth(tokenData, userData);
        toast.success("Registration successful! Welcome to HallMS.");
        navigate(userData.role === "student" ? "/dashboard/student/overview" : "/dashboard/admin/overview");
      }
    },
    onError: (error: any) => {
      toast.error(extractErrorMessage(error));
    },
  });

  const logout = () => {
    storeLogout();
    queryClient.clear();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => authService.getProfile(),
    enabled: !!token,
    retry: false,
  });

  return {
    user: profileData?.data || user,
    token,
    role,
    isAuthenticated: !!token,
    isLoadingProfile,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout,
  };
};
