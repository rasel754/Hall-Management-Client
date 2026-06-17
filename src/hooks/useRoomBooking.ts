import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { studentService } from "@/services/student.service";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/api";

export const useRoomBooking = () => {
  const queryClient = useQueryClient();

  const roomsQuery = useQuery({
    queryKey: ["rooms"],
    queryFn: () => studentService.getAllRooms(),
  });

  const bookingsQuery = useQuery({
    queryKey: ["bookings"],
    queryFn: () => studentService.getBookings(),
  });

  const bookRoomMutation = useMutation({
    mutationFn: (data: { roomId: string; hallId: string; startDate: string; remarks?: string }) =>
      studentService.bookRoom(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["student-room"] });
      toast.success(res.message || "Room booked successfully! Awaiting admin approval.");
    },
    onError: (error: any) => {
      toast.error(extractErrorMessage(error));
    },
  });

  const cancelBookingMutation = useMutation({
    mutationFn: ({ bookingId, data }: { bookingId: string; data?: { reason: string; details: string } }) =>
      studentService.cancelBooking(bookingId, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["student-room"] });
      toast.success(res.message || "Seat booking cancelled successfully.");
    },
    onError: (error: any) => {
      toast.error(extractErrorMessage(error));
    },
  });

  return {
    rooms: roomsQuery.data?.data || roomsQuery.data || [],
    isLoadingRooms: roomsQuery.isLoading,
    refetchRooms: roomsQuery.refetch,
    bookings: bookingsQuery.data?.data || bookingsQuery.data || [],
    isLoadingBookings: bookingsQuery.isLoading,
    bookRoom: bookRoomMutation.mutate,
    bookRoomAsync: bookRoomMutation.mutateAsync,
    isBooking: bookRoomMutation.isPending,
    cancelBooking: cancelBookingMutation.mutate,
    cancelBookingAsync: cancelBookingMutation.mutateAsync,
    isCancelling: cancelBookingMutation.isPending,
  };
};
