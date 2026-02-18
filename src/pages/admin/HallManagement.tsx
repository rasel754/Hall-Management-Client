import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import {
    PlusCircle,
    Loader2,
    AlertCircle,
    Building2,
    Trash2,
    Pencil,
    MapPin,
    Bed,
    CheckCircle2
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { Badge } from "@/components/ui/badge";

const HallManagement = () => {
    const [halls, setHalls] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [currentHall, setCurrentHall] = useState<any>(null); // For edit/delete
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        description: "",
        totalRooms: 0,
        availableRooms: 0,
        amenities: "",
        isActive: true,
    });
    const [submitting, setSubmitting] = useState(false);

    // Fetch halls on mount
    useEffect(() => {
        fetchHalls();
    }, []);

    const fetchHalls = async () => {
        try {
            setLoading(true);

            const response = await adminService.getAllHalls();


            // Robust data extraction
            let hallData: any[] = [];

            if (Array.isArray(response)) {
                hallData = response;
            } else if (response && Array.isArray(response.data)) {
                hallData = response.data;
            } else if (response && response.data && Array.isArray(response.data.data)) {
                hallData = response.data.data;
            } else if (response && Array.isArray(response.halls)) { // Likely pattern
                hallData = response.halls;
            } else if (response && response.data && Array.isArray(response.data.halls)) {
                hallData = response.data.halls;
            } else if (response && response.result && Array.isArray(response.result)) {
                hallData = response.result;
            } else {
                // Fallback: search for first array property
                const keys = Object.keys(response || {});
                for (const key of keys) {
                    if (Array.isArray(response[key])) {

                        hallData = response[key];
                        break;
                    }
                }
            }



            if (hallData.length === 0 && (!Array.isArray(hallData) || hallData.length === 0)) {
                console.warn("⚠️ No halls found or extraction failed.");
            }

            setHalls(hallData);
        } catch (error: any) {
            console.error("❌ Failed to fetch halls:", error);
            // More detailed error logging
            if (error.response) {
                console.error("Error Status:", error.response.status);
                console.error("Error Data:", error.response.data);
            }
            toast.error("Failed to load halls", {
                description: "Please check the console for details."
            });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            address: "",
            description: "",
            totalRooms: 0,
            availableRooms: 0,
            amenities: "",
            isActive: true,
        });
        setIsEditing(false);
        setCurrentHall(null);
    };

    const handleOpenCreate = () => {
        resetForm();
        setOpenDialog(true);
    };

    const handleOpenEdit = (hall: any) => {
        setCurrentHall(hall);
        setFormData({
            name: hall.name,
            address: hall.address,
            description: hall.description || "",
            totalRooms: hall.totalRooms,
            availableRooms: hall.availableRooms,
            amenities: Array.isArray(hall.amenities) ? hall.amenities.join(", ") : hall.amenities || "",
            isActive: hall.isActive,
        });
        setIsEditing(true);
        setOpenDialog(true);
    };

    const handleOpenDelete = (hall: any) => {
        setCurrentHall(hall);
        setOpenDeleteDialog(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.address) {
            toast.error("Required Fields", { description: "Name and Address are required." });
            return;
        }

        if (formData.availableRooms > formData.totalRooms) {
            toast.error("Invalid Configuration", { description: "Available rooms cannot exceed total rooms." });
            return;
        }

        setSubmitting(true);

        try {
            const amenitiesList = formData.amenities
                .split(',')
                .map(item => item.trim())
                .filter(item => item !== "");

            const payload = { ...formData, amenities: amenitiesList };

            if (isEditing && currentHall) {
                await adminService.updateHall(currentHall._id, payload);
                toast.success("Hall Updated Successfully");
            } else {
                await adminService.createHall(payload);
                toast.success("Hall Created Successfully");
            }

            setOpenDialog(false);
            resetForm();
            fetchHalls(); // Refresh list
        } catch (error: any) {
            console.error('Operation failed:', error);
            toast.error(isEditing ? "Failed to update hall" : "Failed to create hall", {
                description: error.response?.data?.message || "An unexpected error occurred."
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!currentHall) return;

        try {
            await adminService.deleteHall(currentHall._id);
            toast.success("Hall Deleted Successfully");
            setOpenDeleteDialog(false);
            fetchHalls();
        } catch (error: any) {
            console.error('Delete failed:', error);
            toast.error("Failed to delete hall");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Hall Management</h1>
                    <p className="text-muted-foreground mt-1">Manage residence halls, rooms, and facilities</p>
                </div>
                <Button onClick={handleOpenCreate}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Hall
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {halls.length === 0 ? (
                        <div className="col-span-full text-center py-10 text-muted-foreground">
                            No halls found. Create one to get started.
                        </div>
                    ) : (
                        halls.map((hall) => (
                            <Card key={hall._id} className="flex flex-col">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-xl">{hall.name}</CardTitle>
                                        <Badge variant={hall.isActive ? "default" : "destructive"}>
                                            {hall.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>
                                    <CardDescription className="flex items-center gap-1 mt-1">
                                        <MapPin className="h-3 w-3" />
                                        {hall.address}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 space-y-4">
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {hall.description || "No description provided."}
                                    </p>

                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                                            <Bed className="h-4 w-4 text-primary" />
                                            <div className="flex flex-col">
                                                <span className="text-xs text-muted-foreground">Total</span>
                                                <span className="font-semibold">{hall.totalRooms}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            <div className="flex flex-col">
                                                <span className="text-xs text-muted-foreground">Available</span>
                                                <span className="font-semibold">{hall.availableRooms}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {hall.amenities && hall.amenities.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {hall.amenities.slice(0, 3).map((amenity: string, idx: number) => (
                                                <Badge key={idx} variant="outline" className="text-xs">
                                                    {amenity}
                                                </Badge>
                                            ))}
                                            {hall.amenities.length > 3 && (
                                                <span className="text-xs text-muted-foreground self-center">
                                                    +{hall.amenities.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="flex gap-2 pt-2">
                                    <Button variant="outline" className="flex-1" onClick={() => handleOpenEdit(hall)}>
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                    <Button variant="destructive" size="icon" onClick={() => handleOpenDelete(hall)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {/* Create/Edit Dialog */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? "Edit Hall" : "Create New Hall"}</DialogTitle>
                        <DialogDescription>
                            {isEditing ? "Update existing hall details." : "Add a new residence hall to the system."}
                        </DialogDescription>
                    </DialogHeader>

                    <form id="hall-form" onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Hall Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Bangabandhu Hall"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address *</Label>
                                <Input
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="e.g. Campus Road, 1234"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Brief description..."
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="totalRooms">Total Rooms *</Label>
                                <Input
                                    id="totalRooms"
                                    type="number"
                                    min="0"
                                    value={formData.totalRooms}
                                    onChange={(e) => setFormData({ ...formData, totalRooms: parseInt(e.target.value) || 0 })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="availableRooms">Available Rooms *</Label>
                                <Input
                                    id="availableRooms"
                                    type="number"
                                    min="0"
                                    value={formData.availableRooms}
                                    onChange={(e) => setFormData({ ...formData, availableRooms: parseInt(e.target.value) || 0 })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amenities">Amenities (comma separated)</Label>
                            <Input
                                id="amenities"
                                value={formData.amenities}
                                onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                                placeholder="e.g. WiFi, Gym, Library"
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isActive"
                                checked={formData.isActive}
                                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
                            />
                            <Label htmlFor="isActive">Active Status</Label>
                        </div>
                    </form>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button type="submit" form="hall-form" disabled={submitting}>
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : (isEditing ? "Update Hall" : "Create Hall")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the hall
                            "{currentHall?.name}" and remove its data from the servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default HallManagement;
