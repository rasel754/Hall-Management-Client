import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { adminService } from "@/services/admin.service";
import { Building, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Room {
  _id?: string;
  id?: string;
  number: string;
  capacity: number;
  occupied: number;
  available: boolean;
}

const AvailableRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const response = await adminService.getAvailableRooms();
      if (response.success) {
        setRooms(response.data || []);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load rooms");
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

  const stats = [
    {
      title: "Total Rooms",
      value: rooms.length,
      icon: Building,
    },
    {
      title: "Available",
      value: rooms.filter((r) => r.available).length,
      icon: Building,
    },
    {
      title: "Occupied",
      value: rooms.filter((r) => !r.available).length,
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
          <Card key={room._id || room.id} className="hover:shadow-md transition-shadow">
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AvailableRooms;
