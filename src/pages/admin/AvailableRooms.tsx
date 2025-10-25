import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockRooms, Room } from "@/data/rooms";
import { toast } from "sonner";
import { Building, Users, DollarSign, Edit } from "lucide-react";

const AvailableRooms = () => {
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleStatusChange = (roomId: string) => {
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === roomId) {
          const newStatus =
            r.status === "available" ? "maintenance" : r.status === "maintenance" ? "full" : "available";
          return { ...r, status: newStatus };
        }
        return r;
      })
    );
    toast.success("Room status updated");
  };

  const getStatusColor = (status: Room["status"]) => {
    switch (status) {
      case "available":
        return "default";
      case "full":
        return "secondary";
      case "maintenance":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const stats = [
    {
      title: "Total Rooms",
      value: rooms.length,
      icon: Building,
    },
    {
      title: "Available",
      value: rooms.filter((r) => r.status === "available").length,
      icon: Building,
    },
    {
      title: "Occupied",
      value: rooms.filter((r) => r.status === "full").length,
      icon: Users,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Available Rooms</h1>
        <p className="text-muted-foreground mt-2">Manage room inventory and availability</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Card key={room.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Room {room.roomNumber}</CardTitle>
                  <CardDescription>{room.building} - Floor {room.floor}</CardDescription>
                </div>
                <Badge variant={getStatusColor(room.status)}>{room.status}</Badge>
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
                  {room.amenities.slice(0, 2).map((amenity) => (
                    <Badge key={amenity} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {room.amenities.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{room.amenities.length - 2}
                    </Badge>
                  )}
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                size="sm"
                onClick={() => handleStatusChange(room.id)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Change Status
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AvailableRooms;
