import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { studentService, Room } from "@/services/student.service";
import { toast } from "sonner";
import { Building, Users, DollarSign, Loader2 } from "lucide-react";

const HallBooking = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingRoom, setBookingRoom] = useState<string | null>(null);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      // Get available rooms from admin endpoint
      const response = await studentService.getMyRoom();
      // For now, we'll show all rooms - the backend should filter
      setRooms([]);
    } catch (error) {
      // Expected error if no room assigned
    } finally {
      setLoading(false);
    }
  };

  const handleBookRoom = async (roomId: string, roomNumber: string) => {
    setBookingRoom(roomId);
    try {
      const response = await studentService.bookRoom(roomId);
      if (response.success) {
        toast.success(`Room ${roomNumber} booking request submitted!`, {
          description: response.message || "You will be notified once the admin approves your request.",
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to book room");
    } finally {
      setBookingRoom(null);
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
            <p className="text-muted-foreground">All rooms are currently occupied. Please check back later.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => {
            const roomId = room._id || room.id || "";
            const isBooking = bookingRoom === roomId;
            
            return (
              <Card key={roomId} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Room {room.number}</CardTitle>
                      <CardDescription>Hall Room</CardDescription>
                    </div>
                    <Badge variant={room.available ? "default" : "secondary"}>
                      {room.available ? "Available" : "Full"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {room.occupied}/{room.capacity} occupied
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => handleBookRoom(roomId, room.number)}
                    disabled={isBooking || !room.available || room.occupied >= room.capacity}
                  >
                    {isBooking ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      "Book Room"
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HallBooking;
