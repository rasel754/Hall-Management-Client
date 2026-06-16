import React, { useEffect, useState, useMemo } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { adminService } from "@/services/admin.service";
import { studentService, Room } from "@/services/student.service";
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
import { Grid, List, Search, UserCheck, Loader2, Calendar, Mail, SlidersHorizontal, Bed } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const assignSchema = z.object({
  studentEmail: z.string().email("Please enter a valid student email address"),
  startDate: z.string().min(1, "Move-in date is required"),
});

type AssignFormValues = z.infer<typeof assignSchema>;

export default function AvailableRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedFloor, setSelectedFloor] = useState<string>("ALL");

  // Allocation Modal state
  const [allocationTarget, setAllocationTarget] = useState<Room | null>(null);
  const [processing, setProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssignFormValues>({
    resolver: zodResolver(assignSchema),
  });

  const fetchRooms = async () => {
    try {
      const res = await adminService.getAllRooms();
      setRooms(res.data || res || []);
    } catch (err) {
      toast.error((err as any).response?.data?.message || "Failed to load room directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleOpenAssign = (room: Room) => {
    setAllocationTarget(room);
    reset({
      studentEmail: "",
      startDate: new Date().toISOString().split("T")[0],
    });
  };

  const handleCloseAssign = () => {
    setAllocationTarget(null);
  };

  const handleConfirmAssignmentSubmit = async (data: AssignFormValues) => {
    if (!allocationTarget) return;
    setProcessing(true);
    try {
      // Simulate booking creation and approval in one transaction for direct admin assignment
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Update room occupancy on mock state
      await adminService.updateRoom(allocationTarget._id || allocationTarget.id || "", {
        occupied: (allocationTarget.occupied || 0) + 1,
        status: (allocationTarget.occupied || 0) + 1 >= (allocationTarget.capacity || 2) ? "occupied" : "available",
      });

      toast.success(`Student ${data.studentEmail} successfully assigned to Room ${allocationTarget.roomNumber || allocationTarget.number}!`);
      handleCloseAssign();
      fetchRooms();
    } catch (err) {
      toast.error((err as any).response?.data?.message || "Failed to assign student to room.");
    } finally {
      setProcessing(false);
    }
  };

  // Filter Logic
  const filteredRooms = useMemo(() => {
    let result = [...rooms];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          String(r.roomNumber || r.number || "").toLowerCase().includes(q)
      );
    }

    if (selectedType && selectedType !== "ALL") {
      result = result.filter(
        (r) => String(r.type || "").toLowerCase() === selectedType.toLowerCase()
      );
    }

    if (selectedFloor && selectedFloor !== "ALL") {
      result = result.filter(
        (r) => String(r.floor || "").toLowerCase() === selectedFloor.toLowerCase()
      );
    }

    return result;
  }, [rooms, searchQuery, selectedType, selectedFloor]);

  const columns: Column<Room>[] = [
    {
      header: "Room Number",
      accessorKey: "roomNumber",
      cell: (row) => <span className="font-bold text-foreground">Room {row.roomNumber || row.number}</span>,
    },
    {
      header: "Floor Plan",
      accessorKey: "floor",
      cell: (row) => <span>Floor {row.floor || "1"}</span>,
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: (row) => <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-semibold">{row.type || "Double"}</span>,
    },
    {
      header: "Occupancy Cap",
      cell: (row) => <span>{row.occupied || 0} / {row.capacity || 2} Housed</span>,
    },
    {
      header: "Monthly Cost",
      cell: (row) => <span className="font-bold text-primary">${row.price || 2200}/mo</span>,
    },
    {
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Assign Action",
      cell: (row) => {
        const isAvailable = row.status === "available" || row.available !== false;
        return (
          <Button
            onClick={() => handleOpenAssign(row)}
            disabled={!isAvailable}
            size="sm"
            className="h-8 rounded-lg text-xs font-semibold px-3 flex items-center gap-1"
          >
            <UserCheck className="h-3.5 w-3.5" />
            Assign Student
          </Button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Available Rooms Preview"
        subtitle="Browse building inventory, toggle layouts, and assign students directly to rooms."
        action={
          <div className="flex items-center gap-1.5 border border-border p-1 rounded-lg bg-card shadow-sm">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 rounded-md"
              title="Grid View"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("table")}
              className="h-8 w-8 rounded-md"
              title="Table View"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      {/* Filter panel */}
      <Card className="border-border bg-card shadow-sm rounded-xl">
        <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px] w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search room number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-card border-input rounded-lg h-10 w-full"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground hidden md:block" />
            <Select value={selectedType} onValueChange={setSelectedType}>
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

            <Select value={selectedFloor} onValueChange={setSelectedFloor}>
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
          </div>
        </CardContent>
      </Card>

      {/* Listing Content */}
      {loading ? (
        <Card className="p-12"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /></Card>
      ) : filteredRooms.length === 0 ? (
        <EmptyState
          icon={Bed}
          title="No rooms found"
          description="Try relaxing your filters or check room parameters in Hall Management."
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRooms.map((room) => {
            const isAvailable = room.status === "available" || room.available !== false;
            return (
              <Card
                key={room._id || room.id}
                className="border-border bg-card shadow-md rounded-xl overflow-hidden flex flex-col justify-between hover:shadow-lg transition-shadow"
              >
                <div className="h-36 bg-muted relative flex items-center justify-center">
                  <span className="text-4xl text-slate-400">🛏️</span>
                  <div className="absolute top-3 right-3">
                    <StatusBadge status={room.status} />
                  </div>
                </div>
                <CardContent className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <h3 className="text-base font-bold text-foreground">Room {room.roomNumber || room.number}</h3>
                      <span className="text-[10px] text-muted-foreground font-semibold">Floor {room.floor || "1"}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Type: {room.type || "Double"}</p>
                    <p className="text-xs text-muted-foreground">Occupied: {room.occupied || 0} / {room.capacity || 2}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex flex-col gap-3">
                    <span className="text-xs font-bold text-primary">${room.price || 2200}/mo</span>
                    <Button
                      onClick={() => handleOpenAssign(room)}
                      disabled={!isAvailable}
                      className="w-full rounded-lg text-xs h-9 px-3 flex items-center justify-center gap-1"
                    >
                      <UserCheck className="h-4 w-4" />
                      Assign Student
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-border bg-card shadow-md rounded-xl p-6">
          <DataTable
            columns={columns}
            data={filteredRooms}
            paginated={true}
            pageSize={8}
          />
        </Card>
      )}

      {/* Assign Student Dialog Modal */}
      {allocationTarget && (
        <Dialog open={!!allocationTarget} onOpenChange={(open) => !open && handleCloseAssign()}>
          <DialogContent className="sm:max-w-[420px] rounded-xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Assign Student to Room</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Allocating Room {allocationTarget.roomNumber || allocationTarget.number} in {allocationTarget.hallId?.name || "Student Hall"}.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(handleConfirmAssignmentSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="assign-student-email" className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  Student Email Address
                </Label>
                <Input
                  id="assign-student-email"
                  type="email"
                  placeholder="student.name@university.edu"
                  {...register("studentEmail")}
                  className={errors.studentEmail ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                  disabled={processing}
                  required
                />
                {errors.studentEmail && (
                  <p className="text-xs text-destructive">{errors.studentEmail.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="assign-start-date" className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  Assignment Move-In Date
                </Label>
                <Input
                  id="assign-start-date"
                  type="date"
                  {...register("startDate")}
                  className={errors.startDate ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                  disabled={processing}
                  required
                />
                {errors.startDate && (
                  <p className="text-xs text-destructive">{errors.startDate.message}</p>
                )}
              </div>

              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCloseAssign}
                  disabled={processing}
                  className="rounded-lg text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={processing}
                  className="rounded-lg text-xs font-semibold px-4 flex items-center gap-1.5"
                >
                  {processing && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Assign Seat
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
