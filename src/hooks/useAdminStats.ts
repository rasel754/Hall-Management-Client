import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/api";

export const useAdminStats = () => {
  const queryClient = useQueryClient();

  const dashboardQuery = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: () => adminService.getDashboard(),
  });

  const bookingsQuery = useQuery({
    queryKey: ["admin-room-bookings"],
    queryFn: () => adminService.getRoomBookings(),
  });

  const approveBookingMutation = useMutation({
    mutationFn: (id: string) => adminService.approveRoomBooking(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["admin-room-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success(res.message || "Booking request approved successfully.");
    },
    onError: (error: any) => {
      toast.error(extractErrorMessage(error));
    },
  });

  const rejectBookingMutation = useMutation({
    mutationFn: (id: string) => adminService.rejectRoomBooking(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["admin-room-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success(res.message || "Booking request rejected successfully.");
    },
    onError: (error: any) => {
      toast.error(extractErrorMessage(error));
    },
  });

  return {
    stats: dashboardQuery.data?.data || null,
    isLoadingStats: dashboardQuery.isLoading,
    refetchStats: dashboardQuery.refetch,
    bookings: bookingsQuery.data?.data || bookingsQuery.data || [],
    isLoadingBookings: bookingsQuery.isLoading,
    refetchBookings: bookingsQuery.refetch,
    approveBooking: approveBookingMutation.mutate,
    approveBookingAsync: approveBookingMutation.mutateAsync,
    isApproving: approveBookingMutation.isPending,
    rejectBooking: rejectBookingMutation.mutate,
    rejectBookingAsync: rejectBookingMutation.mutateAsync,
    isRejecting: rejectBookingMutation.isPending,
  };
};
