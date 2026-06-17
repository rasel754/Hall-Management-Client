import React, { useState, useMemo } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { SkeletonCard } from "@/components/ui/skeleton-custom";
import { EmptyState } from "@/components/ui/empty-state";
import { useRoomBooking } from "@/hooks/useRoomBooking";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, SlidersHorizontal, Bed, Check, ChevronLeft, ChevronRight, Loader2, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const bookingSchema = z.object({
  startDate: z.string().min(1, "Move-in date is required"),
  remarks: z.string().max(200, "Remarks must be under 200 characters").optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function HallBooking() {
  const { rooms, isLoadingRooms, bookRoom } = useRoomBooking();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedFloor, setSelectedFloor] = useState<string>("ALL");
  const [selectedAvailability, setSelectedAvailability] = useState<string>("ALL");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Booking Modal state
  const [activeBookingRoom, setActiveBookingRoom] = useState<any | null>(null);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
  });

  // Filter Logic
  const filteredRooms = useMemo(() => {
    let result = [...rooms];

    // Room number text search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          String(r.roomNumber || r.number || "").toLowerCase().includes(q)
      );
    }

    // Room Type filter
    if (selectedType && selectedType !== "ALL") {
      result = result.filter(
        (r) => String(r.type || "").toLowerCase() === selectedType.toLowerCase()
      );
    }

    // Floor filter
    if (selectedFloor && selectedFloor !== "ALL") {
      result = result.filter(
        (r) => String(r.floor || "").toLowerCase() === selectedFloor.toLowerCase()
      );
    }

    // Availability filter
    if (selectedAvailability === "AVAILABLE") {
      result = result.filter((r) => r.status === "available" || r.available !== false);
    }

    return result;
  }, [rooms, searchQuery, selectedType, selectedFloor, selectedAvailability]);

  // Pagination indexes
  const totalPages = Math.ceil(filteredRooms.length / pageSize);
  const paginatedRooms = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredRooms.slice(startIdx, startIdx + pageSize);
  }, [filteredRooms, currentPage]);

  const handleOpenBooking = (room: any) => {
    setActiveBookingRoom(room);
    reset({
      startDate: new Date().toISOString().split("T")[0],
      remarks: "",
    });
  };

  const handleCloseBooking = () => {
    setActiveBookingRoom(null);
  };

  const handleConfirmBookingSubmit = async (data: BookingFormValues) => {
    if (!activeBookingRoom) return;
    setIsSubmittingBooking(true);
    try {
      await bookRoom({
        roomId: activeBookingRoom._id || activeBookingRoom.id,
        hallId: activeBookingRoom.hallId?._id || activeBookingRoom.hallId || "64fbcfc8e404b901a1adbeef",
        startDate: data.startDate,
        remarks: data.remarks || "",
      });
      handleCloseBooking();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Hall Seat Booking"
        subtitle="Search and book vacancies across residence halls."
      />

      {/* Filter Options Panel */}
      <Card className="border-border bg-card shadow-sm rounded-xl">
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4 flex-wrap">
          {/* Text Search */}
          <div className="relative flex-1 min-w-[200px] w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search room number..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 bg-card border-input rounded-lg h-10 w-full"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground hidden md:block" />

            {/* Type */}
            <Select
              value={selectedType}
              onValueChange={(val) => {
                setSelectedType(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[130px] bg-card rounded-lg h-10 border-border">
                <SelectValue placeholder="Room Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Double">Double</SelectItem>
                <SelectItem value="Triple">Triple</SelectItem>
              </SelectContent>
            </Select>

            {/* Floor */}
            <Select
              value={selectedFloor}
              onValueChange={(val) => {
                setSelectedFloor(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[130px] bg-card rounded-lg h-10 border-border">
                <SelectValue placeholder="Floor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Floors</SelectItem>
                <SelectItem value="1">Floor 1</SelectItem>
                <SelectItem value="2">Floor 2</SelectItem>
                <SelectItem value="3">Floor 3</SelectItem>
                <SelectItem value="4">Floor 4</SelectItem>
              </SelectContent>
            </Select>

            {/* Availability */}
            <Select
              value={selectedAvailability}
              onValueChange={(val) => {
                setSelectedAvailability(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[150px] bg-card rounded-lg h-10 border-border">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Rooms</SelectItem>
                <SelectItem value="AVAILABLE">Available Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Grid listing */}
      {isLoadingRooms ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : filteredRooms.length === 0 ? (
        <EmptyState
          icon={Bed}
          title="No vacant rooms found"
          description="Try broadening your room search parameters or contact administration regarding room status updates."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedRooms.map((room: any) => {
              const isAvailable = room.status === "available" || room.available !== false;
              return (
                <Card
                  key={room._id || room.id}
                  className="border-border bg-card shadow-md rounded-xl overflow-hidden flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all"
                >
                  <div className="h-44 bg-muted relative flex items-center justify-center">
                    <span className="text-5xl text-slate-400">🛏️</span>
                    <span
                      className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isAvailable
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : "bg-destructive/10 text-destructive border-destructive/20"
                      }`}
                    >
                      {isAvailable ? "Available" : "Occupied"}
                    </span>
                  </div>
                  <CardContent className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-foreground">
                          Room {room.roomNumber || room.number}
                        </h3>
                        <span className="text-xs text-muted-foreground font-semibold">
                          Floor {room.floor || "1"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Type: {room.type ? room.type.charAt(0).toUpperCase() + room.type.slice(1) : "Double Shared"}</p>
                      <p className="text-xs text-muted-foreground">
                        Capacity: {room.currentOccupancy || room.occupied || 0} / {room.capacity || 2} Housed
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                      <span className="text-sm font-extrabold text-primary">${room.pricePerMonth || room.price || 2000}/mo</span>
                      <Button
                        onClick={() => handleOpenBooking(room)}
                        disabled={!isAvailable}
                        size="sm"
                        className="rounded-lg text-xs h-8 px-3 font-semibold"
                      >
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <span className="text-xs text-muted-foreground">
                Page {currentPage} of {totalPages} ({filteredRooms.length} rooms)
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0 rounded-lg"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0 rounded-lg"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Booking Form Modal */}
      {activeBookingRoom && (
        <Dialog open={!!activeBookingRoom} onOpenChange={(open) => !open && handleCloseBooking()}>
          <DialogContent className="sm:max-w-[420px] rounded-xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Room Seat Booking</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Booking Room {activeBookingRoom.roomNumber || activeBookingRoom.number} at ${activeBookingRoom.pricePerMonth || activeBookingRoom.price || 2000}/mo.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(handleConfirmBookingSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="booking-start-date" className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  Move-In Date
                </Label>
                <Input
                  id="booking-start-date"
                  type="date"
                  {...register("startDate")}
                  className={errors.startDate ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                  disabled={isSubmittingBooking}
                  required
                />
                {errors.startDate && (
                  <p className="text-xs text-destructive">{errors.startDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="booking-remarks">Booking Remarks (Optional)</Label>
                <Textarea
                  id="booking-remarks"
                  placeholder="Mention roommate preferences or details..."
                  rows={3}
                  {...register("remarks")}
                  className={errors.remarks ? "border-destructive focus-visible:ring-destructive rounded-lg" : "rounded-lg"}
                  disabled={isSubmittingBooking}
                />
                {errors.remarks && (
                  <p className="text-xs text-destructive">{errors.remarks.message}</p>
                )}
              </div>

              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCloseBooking}
                  disabled={isSubmittingBooking}
                  className="rounded-lg text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingBooking}
                  className="rounded-lg text-xs font-semibold px-4"
                >
                  {isSubmittingBooking && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                  Confirm Booking
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
