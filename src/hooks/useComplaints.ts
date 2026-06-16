import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { studentService, Complaint } from "@/services/student.service";
import { adminService } from "@/services/admin.service";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/api";

export const useComplaints = () => {
  const queryClient = useQueryClient();
  const { role } = useAuthStore();

  const complaintsQuery = useQuery({
    queryKey: ["complaints", role],
    queryFn: () => {
      if (role === "admin") {
        return adminService.getAllComplaints();
      }
      return studentService.getComplaints();
    },
    enabled: !!role,
  });

  const createComplaintMutation = useMutation({
    mutationFn: (data: Partial<Complaint>) => studentService.createComplaint(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
      toast.success(res.message || "Complaint submitted successfully!");
    },
    onError: (error: any) => {
      toast.error(extractErrorMessage(error));
    },
  });

  const resolveComplaintMutation = useMutation({
    mutationFn: (id: string) => adminService.solveComplaint(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
      toast.success(res.message || "Complaint marked as resolved.");
    },
    onError: (error: any) => {
      toast.error(extractErrorMessage(error));
    },
  });

  const deleteComplaintMutation = useMutation({
    mutationFn: (id: string) => studentService.deleteComplaint(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
      toast.success(res.message || "Complaint deleted successfully.");
    },
    onError: (error: any) => {
      toast.error(extractErrorMessage(error));
    },
  });

  return {
    complaints: complaintsQuery.data?.data || complaintsQuery.data || [],
    isLoadingComplaints: complaintsQuery.isLoading,
    refetchComplaints: complaintsQuery.refetch,
    createComplaint: createComplaintMutation.mutate,
    createComplaintAsync: createComplaintMutation.mutateAsync,
    isCreating: createComplaintMutation.isPending,
    resolveComplaint: resolveComplaintMutation.mutate,
    resolveComplaintAsync: resolveComplaintMutation.mutateAsync,
    isResolving: resolveComplaintMutation.isPending,
    deleteComplaint: deleteComplaintMutation.mutate,
    deleteComplaintAsync: deleteComplaintMutation.mutateAsync,
    isDeleting: deleteComplaintMutation.isPending,
  };
};
