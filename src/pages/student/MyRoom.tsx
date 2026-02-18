import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { studentService, Room } from "@/services/student.service";
import { useRoleStore } from "@/store/useRoleStore";
import { DoorOpen, Users, DollarSign, Wifi, Wind, Bath, BookOpen, Loader2, CalendarCheck } from "lucide-react";
import { toast } from "sonner";

const MyRoom = () => {
  const [room, setRoom] = useState<Room | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Add new state for context (Hall Name, etc.)
  const [roomContext, setRoomContext] = useState<{ hallName?: string; approvedAt?: string } | null>(null);

  const { user } = useRoleStore();

  useEffect(() => {
    loadMyRoom();
    loadBookings();
  }, [user]);

  const loadBookings = async () => {
    try {
      const response = await studentService.getBookings();
      let data: any[] = [];
      if (Array.isArray(response)) {
        data = response;
      } else if (response?.data?.bookings && Array.isArray(response.data.bookings)) {
        data = response.data.bookings;
      } else if (response?.data && Array.isArray(response.data)) {
        data = response.data;
      } else if (response?.bookings && Array.isArray(response.bookings)) {
        data = response.bookings;
      } else if (response?.result && Array.isArray(response.result)) {
        data = response.result;
      }
      setBookings(data);
    } catch (error) {
      console.error("Failed to load bookings", error);
    } finally {
      setLoadingBookings(false);
    }
  };

  const loadMyRoom = async () => {
    try {
      let roomId = user?.roomId;
      let context = null;

      // If not in user profile, check approved bookings to find the assigned room
      if (!roomId) {
        const bookingsResponse = await studentService.getBookings();
        let bookingsData: any[] = [];

        if (Array.isArray(bookingsResponse)) {
          bookingsData = bookingsResponse;
        } else if (bookingsResponse?.data?.bookings && Array.isArray(bookingsResponse.data.bookings)) {
          bookingsData = bookingsResponse.data.bookings;
        } else if (bookingsResponse?.data && Array.isArray(bookingsResponse.data)) {
          bookingsData = bookingsResponse.data;
        } else if (bookingsResponse?.bookings && Array.isArray(bookingsResponse.bookings)) {
          bookingsData = bookingsResponse.bookings;
        } else if (bookingsResponse?.result && Array.isArray(bookingsResponse.result)) {
          bookingsData = bookingsResponse.result;
        }

        const approvedBooking = bookingsData.find(b => b.status === 'approved');
        if (approvedBooking) {
          if (approvedBooking.roomId) {
            const rId = approvedBooking.roomId;
            roomId = rId._id || rId.id || (typeof rId === 'string' ? rId : undefined);
          }
          // Capture context from booking
          if (approvedBooking.hallId) {
            context = {
              hallName: approvedBooking.hallId.name || (typeof approvedBooking.hallId === 'string' ? "Student Hall" : "Student Hall"),
              approvedAt: approvedBooking.startDate
            };
          }
        }
      }

      setRoomContext(context);

      if (roomId) {
        try {
          const roomDetailResponse = await studentService.getRoomById(roomId);
          const roomData = roomDetailResponse.data || roomDetailResponse;
          setRoom(roomData);
        } catch (err) {
          console.error("Failed to fetch specific room details", err);
          setRoom(null);
        }
      } else {
        setRoom(null);
      }

    } catch (error: any) {

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

        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">My Bookings</h2>
          {loadingBookings ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : bookings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No booking history found.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {bookings.map((booking: any) => (
                <Card key={booking._id} className="overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">
                          {booking.roomId?.roomNumber ? `Room ${booking.roomId.roomNumber}` : "Room Booking"}
                        </span>
                        <Badge variant={
                          booking.status === 'approved' ? 'default' :
                            booking.status === 'rejected' ? 'destructive' :
                              'secondary'
                        }>
                          {booking.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <span>{booking.hallId?.name || "Hall"}</span>
                        <span>•</span>
                        <span>{new Date(booking.startDate).toLocaleDateString()}</span>
                      </div>
                      {booking.remarks && (
                        <p className="text-sm text-muted-foreground italic">"{booking.remarks}"</p>
                      )}
                    </div>
                    {booking.status === 'pending' && (
                      <div className="text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                        Awaiting Approval
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

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
            <p className="text-xs text-muted-foreground">
              {roomContext?.hallName || room.hallId?.name || "Student Hall"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {room.occupied || 0}/{room.capacity || 0}
            </div>
            <p className="text-xs text-muted-foreground">Capacity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant="default">
                Assigned
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {roomContext?.approvedAt ? `Since ${new Date(roomContext.approvedAt).toLocaleDateString()}` : "Active"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">My Bookings</h2>
        {loadingBookings ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : bookings.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No booking history found.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking: any) => (
              <Card key={booking._id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">
                        {booking.roomId?.roomNumber ? `Room ${booking.roomId.roomNumber}` : "Room Booking"}
                      </span>
                      <Badge variant={
                        booking.status === 'approved' ? 'default' :
                          booking.status === 'rejected' ? 'destructive' :
                            'secondary'
                      }>
                        {booking.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <span>{booking.hallId?.name || "Hall"}</span>
                      <span>•</span>
                      <span>{new Date(booking.startDate).toLocaleDateString()}</span>
                    </div>
                    {booking.remarks && (
                      <p className="text-sm text-muted-foreground italic">"{booking.remarks}"</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {booking.status === 'pending' && (
                      <div className="text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                        Awaiting Approval
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
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
                Total Capacity: {room.capacity || 0}
                <br />
                Currently Occupied: {room.occupied || 0}
                <br />
                Available Spaces: {(room.capacity || 0) - (room.occupied || 0)}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Assignment Status</h4>
              <Badge variant="default">
                Active Assignment
              </Badge>
              {roomContext?.approvedAt && (
                <p className="text-xs text-muted-foreground mt-1">
                  Approved on {new Date(roomContext.approvedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyRoom;
