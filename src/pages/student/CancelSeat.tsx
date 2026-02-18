import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { studentService, Room } from "@/services/student.service";
import { toast } from "sonner";
import { AlertTriangle, Loader2 } from "lucide-react";

const CancelSeat = () => {
  const [activeBooking, setActiveBooking] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    loadBookingInfo();
  }, []);

  const loadBookingInfo = async () => {
    try {
      // Fetch bookings to find active or pending ones
      const response = await studentService.getBookings();
      let bookingsData: any[] = [];

      if (Array.isArray(response)) {
        bookingsData = response;
      } else if (response?.data?.bookings && Array.isArray(response.data.bookings)) {
        bookingsData = response.data.bookings;
      } else if (response?.data && Array.isArray(response.data)) {
        bookingsData = response.data;
      } else if (response?.bookings && Array.isArray(response.bookings)) {
        bookingsData = response.bookings;
      } else if (response?.result && Array.isArray(response.result)) {
        bookingsData = response.result;
      }

      // Prioritize identifying 'approved' bookings, then 'pending'
      const foundBooking = bookingsData.find(b => ['approved', 'pending'].includes(b.status));

      if (foundBooking) {
        setActiveBooking(foundBooking);
      } else {
        setActiveBooking(null);
      }

    } catch (error) {
      console.error("Failed to load booking info", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSeat = async () => {
    if (!activeBooking) return;

    setCancelling(true);
    try {
      // Use the specific booking ID cancellation
      await studentService.cancelBooking(activeBooking._id);

      setCancelled(true);
      setActiveBooking(null); // Clear active booking
      toast.success("Booking cancelled successfully", {
        description: "Your room booking has been cancelled.",
      });

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!activeBooking && !cancelled) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cancel Seat</h1>
          <p className="text-muted-foreground mt-2">Cancel your current room booking</p>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Active Booking</h3>
            <p className="text-muted-foreground">
              You don't have an active or pending room booking to cancel.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (cancelled) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cancel Seat</h1>
          <p className="text-muted-foreground mt-2">Cancel your current room booking</p>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Cancellation Successful</h3>
            <p className="text-muted-foreground">
              Your booking has been cancelled successfully.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const roomNumber = activeBooking?.roomId?.roomNumber || "N/A";
  const hallName = activeBooking?.hallId?.name || "Student Hall";
  const status = activeBooking?.status || "Unknown";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Cancel Seat</h1>
        <p className="text-muted-foreground mt-2">Cancel your current room booking</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Booking Details</CardTitle>
          <CardDescription>Information about your {status} booking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Room Number</p>
              <p className="text-lg font-semibold">{roomNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hall</p>
              <p className="text-lg font-semibold">{hallName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <div className="mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                  {status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Cancel Booking</CardTitle>
          <CardDescription>
            Please note that cancellation is permanent and you will need to reapply for a new room.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Cancellation Terms:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>You must vacate the room within 7 days of approval (if occupied)</li>
                <li>No refund will be provided for the current month</li>
                <li>Security deposit will be refunded within 30 days</li>
                <li>You will need to clear all dues before vacating</li>
              </ul>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full" disabled={cancelling}>
                  {cancelling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    "Cancel My Seat"
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will cancel your current room booking ({roomNumber}). You will need to submit a new booking request if
                    you want to get a room again. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>No, Keep My Room</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancelSeat}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Yes, Cancel Booking
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CancelSeat;
