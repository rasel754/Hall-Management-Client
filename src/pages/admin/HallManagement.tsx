import React, { useEffect, useState, useMemo } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { EmptyState } from "@/components/ui/empty-state";
import { adminService } from "@/services/admin.service";
import { studentService, Room } from "@/services/student.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Building, Plus, Trash2, Edit, Loader2, ListCollapse } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const roomSchema = z.object({
  roomNumber: z.string().min(2, "Room number must be at least 2 characters"),
  floor: z.coerce.number().min(1, "Floor must be at least 1"),
  type: z.string().min(1, "Select room type"),
  capacity: z.coerce.number().min(1, "Minimum capacity is 1"),
  price: z.coerce.number().min(100, "Minimum monthly price is $100"),
});

type RoomFormValues = z.infer<typeof roomSchema>;

export default function HallManagement() {
  const [halls, setHalls] = useState<any[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [activeHall, setActiveHall] = useState<any | null>(null);
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [editRoomTarget, setEditRoomTarget] = useState<Room | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
  });

  const fetchData = async () => {
    try {
      const [hallsRes, roomsRes] = await Promise.all([
        adminService.getAllHalls(),
        adminService.getAllRooms(),
      ]);
      setHalls(hallsRes.data || hallsRes || []);
      setRooms(roomsRes.data || roomsRes || []);
    } catch (err) {
      toast.error((err as any).response?.data?.message || "Failed to load hall inventory databases.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAddRoom = (hall: any) => {
    setActiveHall(hall);
    setEditRoomTarget(null);
    reset({
      roomNumber: "",
      floor: 1,
      type: "Double",
      capacity: 2,
      price: 2200,
    });
    setRoomModalOpen(true);
  };

  const handleOpenEditRoom = (room: Room) => {
    setEditRoomTarget(room);
    reset({
      roomNumber: room.roomNumber || room.number || "",
      floor: Number(room.floor) || 1,
      type: room.type || "Double",
      capacity: room.capacity || 2,
      price: room.price || 2200,
    });
    setRoomModalOpen(true);
  };

  const handleConfirmRoomSave = async (data: RoomFormValues) => {
    setProcessing(true);
    try {
      if (editRoomTarget) {
        // Edit Room
        await adminService.updateRoom(editRoomTarget._id || editRoomTarget.id || "", {
          roomNumber: data.roomNumber,
          floor: data.floor,
          type: data.type,
          capacity: data.capacity,
          price: data.price,
        });
        toast.success("Room updated successfully!");
      } else {
        // Add Room
        await adminService.createRoom({
          roomNumber: data.roomNumber,
          number: data.roomNumber,
          floor: data.floor,
          type: data.type,
          capacity: data.capacity,
          price: data.price,
          status: "available",
          available: true,
          hallId: activeHall._id || activeHall.id,
        });
        toast.success("Room created successfully!");
      }
      setRoomModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error((err as any).response?.data?.message || "Failed to save room details.");
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
  };

  const handleConfirmRoomDelete = async () => {
    if (!deleteTargetId) return;
    setProcessing(true);
    try {
      await adminService.deleteRoom(deleteTargetId);
      toast.success("Room deleted successfully.");
      setDeleteTargetId(null);
      fetchData();
    } catch (err) {
      toast.error((err as any).response?.data?.message || "Failed to delete room.");
    } finally {
      setProcessing(false);
    }
  };

  const handleToggleRoomStatus = async (room: Room) => {
    const nextStatus = room.status === "available" ? "maintenance" : "available";
    try {
      await adminService.updateRoom(room._id || room.id || "", {
        status: nextStatus,
        available: nextStatus === "available",
      });
      toast.success(`Room status updated to ${nextStatus}!`);
      fetchData();
    } catch (err) {
      toast.error((err as any).response?.data?.message || "Failed to modify room status.");
    }
  };

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
      cell: (row) => <span className="text-xs font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{row.type || "Double"}</span>,
    },
    {
      header: "Capacity",
      cell: (row) => <span>{row.occupied || 0} / {row.capacity || 2} Housed</span>,
    },
    {
      header: "Price",
      cell: (row) => <span className="font-bold text-primary">${row.price || 2200}/mo</span>,
    },
    {
      header: "System Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleToggleRoomStatus(row)}
            variant="outline"
            size="sm"
            className="h-8 rounded-lg text-xs font-semibold px-2 hover:bg-muted border-border"
          >
            Toggle Status
          </Button>
          <Button
            onClick={() => handleOpenEditRoom(row)}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary hover:bg-primary/5 rounded-md"
            title="Edit Room"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => handleDeleteClick(row._id || row.id || "")}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-md"
            title="Delete Room"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Hall Management"
        subtitle="Manage building directories, configure room capacities, and adjust status levels."
      />

      {loading ? (
        <Card className="p-12"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /></Card>
      ) : (
        <div className="space-y-8">
          {halls.map((hall) => {
            const hallRooms = rooms.filter(
              (r) =>
                r.hallId?._id === hall._id ||
                r.hallId === hall._id ||
                r.hallId?.id === hall.id ||
                r.hallId === hall.id
            );

            return (
              <Card key={hall._id || hall.id} className="border-border bg-card shadow-md rounded-xl overflow-hidden">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border bg-muted/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                      <Building className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-foreground">{hall.name}</CardTitle>
                      <CardDescription className="text-xs">{hall.address}</CardDescription>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleOpenAddRoom(hall)}
                    size="sm"
                    className="rounded-lg text-xs font-semibold h-9 px-3 flex items-center gap-1.5"
                  >
                    <Plus className="h-4 w-4" />
                    Add Room
                  </Button>
                </CardHeader>
                <CardContent className="p-6 pt-6">
                  {hallRooms.length === 0 ? (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                      No rooms added to this building yet. Click "Add Room" to configure vacancy slots.
                    </div>
                  ) : (
                    <DataTable
                      columns={columns}
                      data={hallRooms}
                      searchKey="roomNumber"
                      searchPlaceholder="Search room number..."
                      paginated={true}
                      pageSize={5}
                    />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add/Edit Room Modal Dialog */}
      {roomModalOpen && (
        <Dialog open={roomModalOpen} onOpenChange={(open) => !open && setRoomModalOpen(false)}>
          <DialogContent className="sm:max-w-[420px] rounded-xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                {editRoomTarget ? "Edit Room Details" : "Add Room to " + activeHall?.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Configure room properties. These parameters will be shown to students on booking listings.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(handleConfirmRoomSave)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="room-number">Room Number</Label>
                <Input
                  id="room-number"
                  placeholder="e.g., 304"
                  {...register("roomNumber")}
                  className={errors.roomNumber ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                  disabled={processing}
                  required
                />
                {errors.roomNumber && (
                  <p className="text-xs text-destructive">{errors.roomNumber.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="room-floor">Floor</Label>
                  <Input
                    id="room-floor"
                    type="number"
                    {...register("floor")}
                    className={errors.floor ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                    disabled={processing}
                    required
                  />
                  {errors.floor && (
                    <p className="text-xs text-destructive">{errors.floor.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="room-type">Room Type</Label>
                  <Select
                    value={watch("type")}
                    onValueChange={(val) => setValue("type", val)}
                  >
                    <SelectTrigger id="room-type" className="w-full bg-card rounded-lg h-10 border-border">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Double">Double</SelectItem>
                      <SelectItem value="Triple">Triple</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-xs text-destructive">{errors.type.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="room-capacity">Max Capacity</Label>
                  <Input
                    id="room-capacity"
                    type="number"
                    {...register("capacity")}
                    className={errors.capacity ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                    disabled={processing}
                    required
                  />
                  {errors.capacity && (
                    <p className="text-xs text-destructive">{errors.capacity.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="room-price">Price ($ per Month)</Label>
                  <Input
                    id="room-price"
                    type="number"
                    {...register("price")}
                    className={errors.price ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                    disabled={processing}
                    required
                  />
                  {errors.price && (
                    <p className="text-xs text-destructive">{errors.price.message}</p>
                  )}
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setRoomModalOpen(false)}
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
                  {editRoomTarget ? "Save Changes" : "Create Room"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <ConfirmModal
          title="Delete Room Slot"
          message="Are you sure you want to delete this room configuration? It will delete the vacancy slot permanently from the catalog list."
          isOpen={!!deleteTargetId}
          onClose={() => setDeleteTargetId(null)}
          onConfirm={handleConfirmRoomDelete}
          confirmText="Delete Room"
          cancelText="Cancel"
          isDestructive={true}
          isLoading={processing}
        />
      )}
    </div>
  );
}
