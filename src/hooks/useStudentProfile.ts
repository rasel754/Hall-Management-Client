import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { studentService } from "@/services/student.service";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/api";

export const useStudentProfile = () => {
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => studentService.updateProfile(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["student-profile"] });
      toast.success(res.message || "Profile updated successfully!");
    },
    onError: (error: any) => {
      toast.error(extractErrorMessage(error));
    },
  });

  const getMyRoomQuery = useQuery({
    queryKey: ["student-room"],
    queryFn: () => studentService.getMyRoom(),
    retry: 1,
  });

  return {
    updateProfile: updateProfileMutation.mutate,
    updateProfileAsync: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
    myRoom: getMyRoomQuery.data?.data || null,
    isLoadingRoom: getMyRoomQuery.isLoading,
    refetchRoom: getMyRoomQuery.refetch,
  };
};
