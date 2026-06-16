import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { studentService, Room } from "@/services/student.service";
import { useAuthStore } from "@/store/authStore";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { DoorOpen, Users, Wifi, Bath, BookOpen, Loader2, Calendar, CheckCircle, ShieldAlert, Award, Grid } from "lucide-react";
import { SkeletonCard } from "@/components/ui/skeleton-custom";
import { toast } from "sonner";

export default function MyRoom() {
  const { user } = useAuthStore();
  const { myRoom, isLoadingRoom } = useStudentProfile();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Fetch student bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await studentService.getBookings();
        setBookings(response.data || response || []);
      } catch (err) {
        console.error("Failed to load bookings", err);
      } finally {
        setLoadingBookings(false);
      }
    };
    fetchBookings();
  }, []);

  const roomImages = [
    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80", // Shared Dorm
    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80", // Bed Study
    "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=600&q=80"  // Common Room Desk
  ];

  const facilities = [
    { name: "Gigabit Wifi", icon: Wifi, available: true },
    { name: "Private Bathroom", icon: Bath, available: true },
    { name: "Air Conditioning", icon: CheckCircle, available: true },
    { name: "Personal Study Desk", icon: BookOpen, available: true }
  ];

  const mockRoommates = [
    { name: "Alexander Hamilton", email: "a.hamilton@university.edu", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" },
    { name: "Marie Curie", email: "m.curie@university.edu", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" }
  ];

  if (isLoadingRoom) {
    return (
      <div className="space-y-6">
        <PageHeader title="My Room" subtitle="Fetching details..." />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="My Room"
        subtitle="Manage your room details, roommates, facilities, and checkout petitions."
      />

      {!myRoom ? (
        <Card className="border-border bg-card shadow-md rounded-xl">
          <CardContent className="p-12 text-center max-w-xl mx-auto space-y-4">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
              <DoorOpen className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground">No Room Allocated</h3>
            <p className="text-sm text-muted-foreground">
              You currently do not have an active room assignment. Browse available options to request a seat booking.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
          {/* Room Summary & Gallery */}
          <div className="lg:col-span-8 space-y-6">
            {/* Details Card */}
            <Card className="border-border bg-card shadow-md rounded-xl overflow-hidden">
              <div className="flex flex-col sm:flex-row border-b border-border">
                {/* Images */}
                <div className="sm:w-1/2 p-4 space-y-2">
                  <div className="h-56 bg-muted rounded-lg overflow-hidden relative border border-border">
                    <img
                      src={roomImages[activeImageIndex]}
                      alt="Room view"
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 bg-slate-900/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Photo {activeImageIndex + 1} of {roomImages.length}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {roomImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`h-14 rounded-md overflow-hidden border-2 transition-all ${
                          activeImageIndex === idx ? "border-primary scale-95" : "border-transparent"
                        }`}
                      >
                        <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Info */}
                <div className="sm:w-1/2 p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-foreground">
                        Room {myRoom.roomNumber || myRoom.number}
                      </h3>
                      <StatusBadge status="active" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                      <div>
                        <span className="text-xs text-muted-foreground block">Floor Plan</span>
                        <span className="font-semibold text-foreground">
                          {myRoom.floor || "1st Floor"}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">Room Type</span>
                        <span className="font-semibold text-foreground">
                          {myRoom.type || "Double Shared"}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">Capacity Limit</span>
                        <span className="font-semibold text-foreground">
                          {myRoom.capacity || 2} Students
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">Rent Cost</span>
                        <span className="font-semibold text-primary">
                          $2200/month
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 mt-6">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider block mb-2">
                      Facilities included
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {facilities.map((fac) => (
                        <div key={fac.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <fac.icon className="h-3.5 w-3.5 text-emerald-500" />
                          <span>{fac.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Roommates Card */}
            <Card className="border-border bg-card shadow-md rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Roommates Directory</CardTitle>
                <CardDescription>Contact info for students in your room allocation</CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-border">
                {mockRoommates.map((rm) => (
                  <div key={rm.name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage src={rm.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {rm.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{rm.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{rm.email}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Stat Cards & Checkout Petitions */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-border bg-card shadow-md rounded-xl">
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-base font-bold">Room Statistics</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Room ID</span>
                  <span className="font-semibold text-foreground text-xs font-mono">{myRoom._id || myRoom.id}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Occupancy Rate</span>
                  <span className="font-semibold text-foreground">
                    {myRoom.occupied || 2} / {myRoom.capacity || 2} Housed
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Allocation Date</span>
                  <span className="font-semibold text-foreground">June 10, 2026</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card shadow-md rounded-xl bg-destructive/5 border-destructive/10">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 text-destructive">
                  <ShieldAlert className="h-5 w-5" />
                  <CardTitle className="text-base font-bold">Seat Petitions</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-destructive">
                  If you need to leave university accommodation or transfer halls, file an seat cancellation request.
                </p>
                <div className="pt-2">
                  <a
                    href="/dashboard/student/cancel-seat"
                    className="text-xs font-bold text-destructive hover:underline flex items-center gap-1.5"
                  >
                    Request seat cancellation
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Booking History logs */}
      <div className="pt-4">
        <h2 className="text-xl font-bold text-foreground mb-4">Seat Application History</h2>
        {loadingBookings ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : bookings.length === 0 ? (
          <Card className="border-border bg-card shadow-md rounded-xl">
            <CardContent className="p-8 text-center text-muted-foreground text-sm">
              No historical booking requests logged.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking: any) => (
              <Card key={booking._id || booking.id} className="overflow-hidden border border-border bg-card shadow-sm rounded-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-base text-foreground">
                        {booking.roomId?.roomNumber ? `Room ${booking.roomId.roomNumber}` : "Room Booking Application"}
                      </span>
                      <StatusBadge status={booking.status} />
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                      <span className="font-semibold">{booking.hallId?.name || "Student Hall"}</span>
                      <span>•</span>
                      <span>Submitted on {new Date(booking.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                    {booking.remarks && (
                      <p className="text-xs text-muted-foreground italic mt-2">
                        "{booking.remarks}"
                      </p>
                    )}
                  </div>
                  {booking.status === "pending" && (
                    <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold px-3 py-1.5 rounded-full border border-amber-500/20 w-fit">
                      Awaiting Warden Action
                    </span>
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
