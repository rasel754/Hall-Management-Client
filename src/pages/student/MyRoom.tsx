import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { studentService, Room } from "@/services/student.service";
import { DoorOpen, Users, DollarSign, Wifi, Wind, Bath, BookOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";

const MyRoom = () => {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyRoom();
  }, []);

  const loadMyRoom = async () => {
    try {
      const response = await studentService.getMyRoom();
      if (response.success && response.data) {
        setRoom(response.data);
      }
    } catch (error: any) {
      if (error.response?.status !== 404) {
        toast.error(error.response?.data?.message || "Failed to load room details");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Room</h1>
          <p className="text-muted-foreground mt-2">View your assigned room details</p>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <DoorOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Room Assigned</h3>
            <p className="text-muted-foreground">You don't have a room assigned yet. Book a room to get started.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const amenityIcons: Record<string, any> = {
    WiFi: Wifi,
    AC: Wind,
    "Attached Bathroom": Bath,
    "Study Desk": BookOpen,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Room</h1>
        <p className="text-muted-foreground mt-2">View your assigned room details</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Room Number</CardTitle>
            <DoorOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{room.number}</div>
            <p className="text-xs text-muted-foreground">Hall Room</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {room.occupied}/{room.capacity}
            </div>
            <p className="text-xs text-muted-foreground">Capacity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant={room.available ? "default" : "secondary"}>
                {room.available ? "Available" : "Full"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Room Status</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Room Details</CardTitle>
          <CardDescription>Complete information about your assigned room</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">Capacity</h4>
              <p className="text-sm text-muted-foreground">
                Total Capacity: {room.capacity}
                <br />
                Currently Occupied: {room.occupied}
                <br />
                Available Spaces: {room.capacity - room.occupied}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Status</h4>
              <Badge variant={room.available ? "default" : "secondary"}>
                {room.available ? "Available" : "Full"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyRoom;
