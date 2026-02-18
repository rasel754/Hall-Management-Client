import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { studentService, Room } from "@/services/student.service";
import { toast } from "sonner";
import { Building, Users, DollarSign, Loader2, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const HallBooking = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    startDate: "",
    remarks: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      // Get available rooms
      const response = await studentService.getAllRooms();


      // Robust data extraction
      let roomsData: Room[] = [];
      if (Array.isArray(response)) {
        roomsData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        roomsData = response.data;
      } else if (response?.rooms && Array.isArray(response.rooms)) {
        roomsData = response.rooms;
      } else if (response?.data?.rooms && Array.isArray(response.data.rooms)) {
        roomsData = response.data.rooms;
      } else if (response?.result && Array.isArray(response.result)) {
        roomsData = response.result;
      } else {
        // Fallback: check if the response object itself has array values
        const possibleArrays = Object.values(response).filter(val => Array.isArray(val));
        if (possibleArrays.length > 0) {
          roomsData = possibleArrays[0] as Room[];
        }
      }


      setRooms(roomsData);
    } catch (error) {
      console.error("Failed to load rooms", error);
      toast.error("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  const openBookingModal = (room: Room) => {
    setSelectedRoom(room);
    setBookingData({ startDate: "", remarks: "" });
    setIsBookingOpen(true);
  };

  const handleBookRoom = async () => {
    if (!selectedRoom || !bookingData.startDate) {
      toast.error("Please select a start date");
      return;
    }

    // Determine correct hall ID
    // Check various possible locations for the ID
    const hallId =
      (typeof selectedRoom.hallId === 'object' ? selectedRoom.hallId?._id : selectedRoom.hallId) ||
      (selectedRoom as any).hall?._id ||
      (selectedRoom as any).hall ||
      (selectedRoom as any).hall_id;



    if (!hallId) {
      toast.error("Invalid room configuration: Missing Hall ID", {
        description: "Could not find hall information for this room. Please report this to support."
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        roomId: selectedRoom._id || selectedRoom.id || "",
        hallId: hallId,
        startDate: new Date(bookingData.startDate).toISOString(),
        remarks: bookingData.remarks
      };

      const response = await studentService.bookRoom(payload);

      toast.success("Booking Request Submitted!", {
        description: response.message || "Your application is pending approval.",
      });

      setIsBookingOpen(false);
      // Refresh rooms to show updated occupancy
      loadRooms();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to book room");
    } finally {
      setSubmitting(false);
    }
  };

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
        <h1 className="text-3xl font-bold text-foreground">Hall Booking</h1>
        <p className="text-muted-foreground mt-2">Browse and book available rooms</p>
      </div>

      {rooms.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Rooms Available</h3>
            <p className="text-muted-foreground">All rooms are currently occupied or unavailable.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => {
            const roomId = room._id || room.id || "";
            const roomName = room.roomNumber || room.number || "Unknown";
            const occupancy = room.currentOccupancy !== undefined ? room.currentOccupancy : (room.occupied || 0);

            // Check for valid Hall ID
            const hallId = (typeof room.hallId === 'object' ? room.hallId?._id : room.hallId) || (room as any).hall?._id || (room as any).hall;
            const hasHallId = !!hallId;
            const isAvailable = (room.available || room.status === 'available') && hasHallId;
            const isFull = occupancy >= room.capacity;
            const canBook = isAvailable && !isFull;

            return (
              <Card key={roomId} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Room {roomName}</CardTitle>
                      <CardDescription>
                        {hasHallId ? ((typeof room.hallId === 'object' ? room.hallId?.name : "Hall Room")) : <span className="text-destructive">Hall Not Assigned</span>}
                      </CardDescription>
                    </div>
                    <Badge variant={canBook ? "default" : "secondary"}>
                      {canBook ? "Available" : (hasHallId ? "Unavailable" : "System Error")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {occupancy}/{room.capacity} occupied
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => openBookingModal(room)}
                    disabled={!canBook}
                  >
                    Book Room
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Book Room {selectedRoom?.roomNumber || selectedRoom?.number}</DialogTitle>
            <DialogDescription>
              Submit a request to book this room. Admin approval required.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Hall</Label>
              <div className="p-2 bg-muted rounded-md text-sm font-medium">
                {selectedRoom?.hallId?.name || "Unknown Hall"}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Start Date *</Label>
              <div className="relative">
                <Input
                  id="date"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={bookingData.startDate}
                  onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks (Optional)</Label>
              <Textarea
                id="remarks"
                placeholder="Any special requests..."
                value={bookingData.remarks}
                onChange={(e) => setBookingData({ ...bookingData, remarks: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookingOpen(false)}>Cancel</Button>
            <Button onClick={handleBookRoom} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting
                </>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HallBooking;
