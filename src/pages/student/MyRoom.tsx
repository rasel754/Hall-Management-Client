import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockRooms } from "@/data/rooms";
import { DoorOpen, Users, DollarSign, Wifi, Wind, Bath, BookOpen } from "lucide-react";

const MyRoom = () => {
  // Mock: assuming user has room 101
  const userRoom = mockRooms.find((room) => room.id === "101");

  if (!userRoom) {
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
            <div className="text-2xl font-bold">{userRoom.roomNumber}</div>
            <p className="text-xs text-muted-foreground">{userRoom.building} - Floor {userRoom.floor}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userRoom.occupied}/{userRoom.capacity}
            </div>
            <p className="text-xs text-muted-foreground capitalize">{userRoom.type} Room</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Rent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${userRoom.pricePerMonth}</div>
            <p className="text-xs text-muted-foreground">Due by 5th of month</p>
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
              <h4 className="font-semibold mb-2">Location</h4>
              <p className="text-sm text-muted-foreground">
                Building: {userRoom.building}
                <br />
                Floor: {userRoom.floor}
                <br />
                Room Type: {userRoom.type}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Status</h4>
              <Badge variant={userRoom.status === "available" ? "default" : "secondary"}>
                {userRoom.status}
              </Badge>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Amenities</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              {userRoom.amenities.map((amenity) => {
                const Icon = amenityIcons[amenity] || BookOpen;
                return (
                  <div key={amenity} className="flex items-center gap-2 text-sm">
                    <Icon className="h-4 w-4 text-primary" />
                    <span>{amenity}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyRoom;
