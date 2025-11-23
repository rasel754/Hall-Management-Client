import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

interface RoomBooking {
  _id?: string;
  id?: string;
  studentName?: string;
  roomId?: string;
  roomNumber?: string;
  status: string;
  requestDate?: string;
  createdAt?: string;
}

const RoomApprovals = () => {
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const response = await adminService.getRooms();
      if (response.success) {
        setBookings(response.data || []);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load room bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (roomId: string, studentName: string) => {
    setApprovingId(roomId);
    try {
      const response = await adminService.approveRoom(roomId);
      if (response.success) {
        toast.success(`Booking approved${studentName ? ` for ${studentName}` : ""}`, {
          description: response.message || "The student will be notified via email.",
        });
        loadRooms();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to approve booking");
    } finally {
      setApprovingId(null);
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
                  const bookingId = booking._id || booking.id || "";
                  const isApproving = approvingId === bookingId;
                  
                  return (
                    <TableRow key={bookingId}>
                      <TableCell className="font-medium">{booking.studentName || "N/A"}</TableCell>
                      <TableCell>Room {booking.roomNumber || booking.roomId || "N/A"}</TableCell>
                      <TableCell>
                        {booking.requestDate 
                          ? new Date(booking.requestDate).toLocaleDateString()
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
                          onClick={() => handleApprove(bookingId, booking.studentName || "")}
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
    </div>
  );
};

export default RoomApprovals;
