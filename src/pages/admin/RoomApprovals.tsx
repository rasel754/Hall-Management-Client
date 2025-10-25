import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockRoomBookings, RoomBooking } from "@/data/rooms";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";

const RoomApprovals = () => {
  const [bookings, setBookings] = useState<RoomBooking[]>(mockRoomBookings);

  const handleApprove = (bookingId: string, studentName: string) => {
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: "approved" } : b)));
    toast.success(`Booking approved for ${studentName}`, {
      description: "The student will be notified via email.",
    });
  };

  const handleReject = (bookingId: string, studentName: string) => {
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: "rejected" } : b)));
    toast.error(`Booking rejected for ${studentName}`, {
      description: "The student will be notified via email.",
    });
  };

  const pendingBookings = bookings.filter((b) => b.status === "pending");

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
                  <TableHead>Move-in Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.studentName}</TableCell>
                    <TableCell>Room {booking.roomId}</TableCell>
                    <TableCell>{new Date(booking.requestDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(booking.moveInDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          booking.status === "approved"
                            ? "outline"
                            : booking.status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {booking.status === "pending" ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(booking.id, booking.studentName)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(booking.id, booking.studentName)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Processed</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomApprovals;
