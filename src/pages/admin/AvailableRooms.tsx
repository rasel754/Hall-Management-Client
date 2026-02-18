import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminService } from "@/services/admin.service";
import {
  Building,
  Users,
  Loader2,
  PlusCircle,
  Pencil,
  Trash2,
  DoorOpen,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface Room {
  _id: string;
  roomNumber: string;
  hallId: any; // Can be ID string or populated Hall object
  floor: number;
  capacity: number;
  currentOccupancy: number;
  status: string;
  monthlyRent: number;
  amenities: string[];
  isActive: boolean;
}

interface Hall {
  _id: string;
  name: string;
}

const AvailableRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    hallId: "",
    roomNumber: "",
    floor: 0,
    capacity: 1,
    currentOccupancy: 0,
    status: "available",
    monthlyRent: 0,
    amenities: "",
    isActive: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [roomsRes, hallsRes] = await Promise.all([
        adminService.getAllRooms(),
        adminService.getAllHalls()
      ]);

      // Robust data extraction for Rooms
      let roomsData = [];
      if (Array.isArray(roomsRes)) roomsData = roomsRes;
      else if (roomsRes?.data?.rooms && Array.isArray(roomsRes.data.rooms)) roomsData = roomsRes.data.rooms;
      else if (roomsRes?.data && Array.isArray(roomsRes.data)) roomsData = roomsRes.data;
      else if (roomsRes?.rooms && Array.isArray(roomsRes.rooms)) roomsData = roomsRes.rooms;

      // Robust data extraction for Halls
      let hallsData = [];
      if (Array.isArray(hallsRes)) hallsData = hallsRes;
      else if (hallsRes?.data?.halls && Array.isArray(hallsRes.data.halls)) hallsData = hallsRes.data.halls;
      else if (hallsRes?.data && Array.isArray(hallsRes.data)) hallsData = hallsRes.data;
      else if (hallsRes?.halls && Array.isArray(hallsRes.halls)) hallsData = hallsRes.halls;

      setRooms(roomsData);
      setHalls(hallsData);
    } catch (error: any) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      hallId: "",
      roomNumber: "",
      floor: 0,
      capacity: 1,
      currentOccupancy: 0,
      status: "available",
      monthlyRent: 0,
      amenities: "",
      isActive: true,
    });
    setIsEditing(false);
    setCurrentRoom(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setOpenDialog(true);
  };

  const handleOpenEdit = (room: Room) => {
    setCurrentRoom(room);
    setFormData({
      hallId: typeof room.hallId === 'object' ? room.hallId?._id : room.hallId,
      roomNumber: room.roomNumber,
      floor: room.floor,
      capacity: room.capacity,
      currentOccupancy: room.currentOccupancy,
      status: room.status,
      monthlyRent: room.monthlyRent,
      amenities: Array.isArray(room.amenities) ? room.amenities.join(", ") : "",
      isActive: room.isActive,
    });
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleOpenDelete = (room: Room) => {
    setCurrentRoom(room);
    setOpenDeleteDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.hallId || !formData.roomNumber) {
      toast.error("Required Fields", { description: "Hall and Room Number are required." });
      return;
    }

    if (formData.currentOccupancy > formData.capacity) {
      toast.error("Invalid Occupancy", { description: "Occupancy cannot exceed capacity." });
      return;
    }

    setSubmitting(true);

    try {
      const amenitiesList = formData.amenities
        .split(',')
        .map(item => item.trim())
        .filter(item => item !== "");

      const payload = { ...formData, amenities: amenitiesList };

      if (isEditing && currentRoom) {
        await adminService.updateRoom(currentRoom._id, payload);
        toast.success("Room Updated");
      } else {
        await adminService.createRoom(payload);
        toast.success("Room Created");
      }

      setOpenDialog(false);
      resetForm();
      loadData();
    } catch (error: any) {
      console.error("Operation failed:", error);
      toast.error(isEditing ? "Failed to update room" : "Failed to create room", {
        description: error.response?.data?.message || "An unexpected error occurred."
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentRoom) return;
    try {
      await adminService.deleteRoom(currentRoom._id);
      toast.success("Room Deleted");
      setOpenDeleteDialog(false);
      loadData();
    } catch (error: any) {
      toast.error("Failed to delete room");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available': return <Badge className="bg-green-500 hover:bg-green-600">Available</Badge>;
      case 'occupied': return <Badge variant="destructive">Occupied</Badge>;
      case 'maintenance': return <Badge variant="secondary">Maintenance</Badge>;
      case 'reserved': return <Badge className="bg-blue-500 hover:bg-blue-600">Reserved</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Safe formatting for hall name
  const getHallName = (hallId: any) => {
    if (!hallId) return "Unknown Hall";
    if (typeof hallId === 'object' && hallId.name) return hallId.name;
    const hall = halls.find(h => h._id === hallId);
    return hall ? hall.name : "Unknown Hall";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Room Management</h1>
          <p className="text-muted-foreground mt-1">Manage rooms across all residence halls</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Room
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Card key={room._id} className="flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <DoorOpen className="h-5 w-5" />
                      {room.roomNumber}
                    </CardTitle>
                    <CardDescription>{getHallName(room.hallId)}</CardDescription>
                  </div>
                  {getStatusBadge(room.status)}
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-3 pb-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex flex-col bg-muted/50 p-2 rounded">
                    <span className="text-xs text-muted-foreground">Floor</span>
                    <span className="font-medium">{room.floor}</span>
                  </div>
                  <div className="flex flex-col bg-muted/50 p-2 rounded">
                    <span className="text-xs text-muted-foreground">Rent</span>
                    <span className="font-medium flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />{room.monthlyRent}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm border p-2 rounded">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Occupancy</span>
                  </div>
                  <span className="font-medium">
                    {room.currentOccupancy} / {room.capacity}
                  </span>
                </div>

                {room.amenities && room.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {room.amenities.slice(0, 3).map((am, idx) => (
                      <Badge key={idx} variant="outline" className="text-[10px] h-5">{am}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0 gap-2">
                <Button variant="outline" className="flex-1 h-8" onClick={() => handleOpenEdit(room)}>
                  <Pencil className="h-3.5 w-3.5 mr-2" />
                  Edit
                </Button>
                <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleOpenDelete(room)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </CardFooter>
            </Card>
          ))}
          {rooms.length === 0 && (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              No rooms found. Add a room to get started.
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Room" : "Create New Room"}</DialogTitle>
            <DialogDescription>Enter room details below.</DialogDescription>
          </DialogHeader>
          <form id="room-form" onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Hall *</Label>
                <Select
                  value={formData.hallId}
                  onValueChange={(val) => setFormData({ ...formData, hallId: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Hall" />
                  </SelectTrigger>
                  <SelectContent>
                    {halls.map(hall => (
                      <SelectItem key={hall._id} value={hall._id}>{hall.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Room Number *</Label>
                <Input
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  placeholder="e.g. 101"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Floor *</Label>
                <Input
                  type="number"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Capacity *</Label>
                <Input
                  type="number" min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Current Occupancy</Label>
                <Input
                  type="number" min="0" max={formData.capacity}
                  value={formData.currentOccupancy}
                  onChange={(e) => setFormData({ ...formData, currentOccupancy: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Monthly Rent *</Label>
                <Input
                  type="number" min="0"
                  value={formData.monthlyRent}
                  onChange={(e) => setFormData({ ...formData, monthlyRent: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) => setFormData({ ...formData, status: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Amenities (comma separated)</Label>
                <Input
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  placeholder="WiFi, AC, Balcony"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="active"
                checked={formData.isActive}
                onCheckedChange={(c) => setFormData({ ...formData, isActive: !!c })}
              />
              <Label htmlFor="active">Active Room</Label>
            </div>
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" form="room-form" disabled={submitting}>
              {submitting ? <Loader2 className="animate-spin h-4 w-4" /> : (isEditing ? "Update" : "Create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Room?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete Room {currentRoom?.roomNumber}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AvailableRooms;
