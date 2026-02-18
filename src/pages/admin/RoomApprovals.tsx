import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

interface RoomBooking {
  _id: string;
  studentId?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    studentId?: string;
  };
  roomId?: {
    roomNumber?: string;
    floor?: number;
  };
  hallId?: {
    name?: string;
  };
  status: string;
  startDate?: string;
  requestDate?: string;
  createdAt?: string;
}

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const RoomApprovals = () => {
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [bookingToApprove, setBookingToApprove] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const response = await adminService.getRoomBookings();


      let bookingsData: RoomBooking[] = [];

      // Handle various response structures
      if (response?.data?.bookings && Array.isArray(response.data.bookings)) {
        bookingsData = response.data.bookings;
      } else if (Array.isArray(response?.data)) {
        bookingsData = response.data;
      } else if (Array.isArray(response)) {
        bookingsData = response;
      }

      setBookings(bookingsData);
    } catch (error: any) {
      console.error('Error loading rooms:', error);
      toast.error(error.response?.data?.message || "Failed to load room bookings");
    } finally {
      setLoading(false);
    }
  };

  const initiateApprove = (bookingId: string, studentName: string) => {
    setBookingToApprove({ id: bookingId, name: studentName });
  };

  const handleApprove = async () => {
    if (!bookingToApprove) return;

    setApprovingId(bookingToApprove.id);
    try {
      const response = await adminService.approveRoomBooking(bookingToApprove.id);
      if (response.success) {
        toast.success(`Booking approved${bookingToApprove.name ? ` for ${bookingToApprove.name}` : ""}`, {
          description: response.message || "The student will be notified via email.",
        });
        loadRooms();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to approve booking");
    } finally {
      setApprovingId(null);
      setBookingToApprove(null);
    }
  };

  const pendingBookings = bookings.filter((b) => b.status === "pending" || b.status === "Pending");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Room Approvals</h1>
        <p className="text-muted-foreground mt-2">Review and manage room booking requests</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Requests ({pendingBookings.length})</CardTitle>
          <CardDescription>Approve or reject room booking applications</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingBookings.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Pending Requests</h3>
              <p className="text-muted-foreground">All room booking requests have been processed.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingBookings.map((booking) => {
                  const bookingId = booking._id;
                  const isApproving = approvingId === bookingId;
                  const studentName = booking.studentId ? `${booking.studentId.firstName} ${booking.studentId.lastName}` : "Unknown Student";
                  const roomNumber = booking.roomId?.roomNumber || "N/A";

                  return (
                    <TableRow key={bookingId}>
                      <TableCell className="font-medium">
                        <div>{studentName}</div>
                        <div className="text-xs text-muted-foreground">{booking.studentId?.email}</div>
                      </TableCell>
                      <TableCell>Room {roomNumber}</TableCell>
                      <TableCell>
                        {booking.startDate
                          ? new Date(booking.startDate).toLocaleDateString()
                          : booking.createdAt
                            ? new Date(booking.createdAt).toLocaleDateString()
                            : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{booking.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => initiateApprove(bookingId, studentName)}
                          disabled={isApproving}
                        >
                          {isApproving ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                              Approving...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!bookingToApprove} onOpenChange={(open) => !open && setBookingToApprove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Booking Request?</AlertDialogTitle>
            <AlertDialogDescription>
              This will approve the room booking for <span className="font-medium text-foreground">{bookingToApprove?.name}</span>.
              The student will be notified and the room status will be updated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Confirm Approval
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RoomApprovals;
