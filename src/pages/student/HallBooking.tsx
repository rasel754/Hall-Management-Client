import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockRooms } from "@/data/rooms";
import { toast } from "sonner";
import { Building, Users, DollarSign } from "lucide-react";

const HallBooking = () => {
  const [bookedRooms, setBookedRooms] = useState<Set<string>>(new Set());
  const availableRooms = mockRooms.filter((room) => room.status === "available");

  const handleBookRoom = (roomId: string, roomNumber: string) => {
    setBookedRooms((prev) => new Set(prev).add(roomId));
    toast.success(`Room ${roomNumber} booking request submitted!`, {
      description: "You will be notified once the admin approves your request.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Hall Booking</h1>
        <p className="text-muted-foreground mt-2">Browse and book available rooms</p>
      </div>

      {availableRooms.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Rooms Available</h3>
            <p className="text-muted-foreground">All rooms are currently occupied. Please check back later.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {availableRooms.map((room) => {
            const isBooked = bookedRooms.has(room.id);
            return (
              <Card key={room.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Room {room.roomNumber}</CardTitle>
                      <CardDescription>{room.building} - Floor {room.floor}</CardDescription>
                    </div>
                    <Badge variant={room.status === "available" ? "default" : "secondary"}>
                      {room.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {room.occupied}/{room.capacity} occupied • {room.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>${room.pricePerMonth}/month</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-1">
                      {room.amenities.slice(0, 3).map((amenity) => (
                        <Badge key={amenity} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {room.amenities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{room.amenities.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => handleBookRoom(room.id, room.roomNumber)}
                    disabled={isBooked || room.occupied >= room.capacity}
                  >
                    {isBooked ? "Request Submitted" : "Book Room"}
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
