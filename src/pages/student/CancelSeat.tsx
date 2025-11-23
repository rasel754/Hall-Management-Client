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
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    loadMyRoom();
  }, []);

  const loadMyRoom = async () => {
    try {
      const response = await studentService.getMyRoom();
      if (response.success && response.data) {
        setRoom(response.data);
      }
    } catch (error) {
      // No room assigned
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSeat = async () => {
    setCancelling(true);
    try {
      const response = await studentService.cancelSeat();
      if (response.success) {
        setCancelled(true);
        toast.success("Seat cancellation request submitted", {
          description: response.message || "Your request will be processed within 2-3 business days.",
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to cancel seat");
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

  if (!room || cancelled) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cancel Seat</h1>
          <p className="text-muted-foreground mt-2">Cancel your current room booking</p>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {cancelled ? "Cancellation Request Submitted" : "No Active Booking"}
            </h3>
            <p className="text-muted-foreground">
              {cancelled
                ? "Your seat cancellation request has been submitted and is under review."
                : "You don't have an active room booking to cancel."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Cancel Seat</h1>
        <p className="text-muted-foreground mt-2">Cancel your current room booking</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Room Details</CardTitle>
          <CardDescription>Information about your current room booking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Room Number</p>
              <p className="text-lg font-semibold">{room.number}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Capacity</p>
              <p className="text-lg font-semibold">
                {room.occupied}/{room.capacity}
              </p>
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
                <li>You must vacate the room within 7 days of approval</li>
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
                    This action will cancel your current room booking. You will need to submit a new booking request if
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
