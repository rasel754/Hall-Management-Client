import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { studentService, Complaint } from "@/services/student.service";
import { useRoleStore } from "@/store/useRoleStore";
import { toast } from "sonner";
import { Plus, Clock, Loader2, Trash2 } from "lucide-react";
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

const Complaints = () => {
  const { user } = useRoleStore();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  const [newComplaint, setNewComplaint] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium" as "low" | "medium" | "high",
  });

  useEffect(() => {
    if (user) {
      loadComplaints();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadComplaints = async () => {
    try {
      const response = await studentService.getComplaints();


      if (Array.isArray(response)) {
        setComplaints(response);
      } else if (response.success && response.data && Array.isArray(response.data.complaints)) {
        setComplaints(response.data.complaints);
      } else if (response.success && Array.isArray(response.data)) {
        setComplaints(response.data);
      } else if (response.complaints && Array.isArray(response.complaints)) {
        // Fallback for some APIs that might return { complaints: [...] }
        setComplaints(response.complaints);
      } else {
        console.warn("Unexpected response format:", response);
        setComplaints([]);
      }
    } catch (error: any) {
      console.error("Error loading complaints:", error);
      toast.error(error.response?.data?.message || "Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newComplaint.title || !newComplaint.description || !newComplaint.category) {
      toast.error("Please fill in all required fields (Title, Description, Category)");
      return;
    }

    const userId = user?.id || user?._id;

    if (!userId) {
      toast.error("User not identified as student");
      return;
    }

    setSubmitting(true);
    try {
      const response = await studentService.createComplaint({
        ...newComplaint,
        studentId: userId
      });

      if (response.success) {
        toast.success("Complaint submitted successfully", {
          description: response.message || "We'll review your complaint and get back to you soon.",
        });
        setNewComplaint({ title: "", description: "", category: "", priority: "medium" });
        setIsDialogOpen(false);
        loadComplaints();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit complaint");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteConfirmationId(id);
  };

  const confirmDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!deleteConfirmationId) return;

    setDeletingId(deleteConfirmationId);
    try {
      await studentService.deleteComplaint(deleteConfirmationId);
      toast.success("Complaint deleted successfully");
      // Optimistic update or reload
      setComplaints(prev => prev.filter(c => (c._id || c.id) !== deleteConfirmationId));
      setDeleteConfirmationId(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete complaint");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "secondary";
      case "resolved":
        return "success";
      default:
        return "secondary";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "outline";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Complaints</h1>
          <p className="text-muted-foreground mt-2">Track and manage your complaints</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Complaint
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Submit a Complaint</DialogTitle>
              <DialogDescription>Describe your issue and we'll address it as soon as possible.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newComplaint.title}
                  onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
                  placeholder="Brief description of the issue"
                  disabled={submitting}
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={newComplaint.category}
                  onValueChange={(value) => setNewComplaint({ ...newComplaint, category: value })}
                  disabled={submitting}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Cleanliness">Cleanliness</SelectItem>
                    <SelectItem value="Noise">Noise</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priority *</Label>
                <Select
                  value={newComplaint.priority}
                  onValueChange={(value: "low" | "medium" | "high") => setNewComplaint({ ...newComplaint, priority: value })}
                  disabled={submitting}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={newComplaint.description}
                  onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                  placeholder="Provide detailed information about the issue"
                  rows={4}
                  disabled={submitting}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Complaint"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {!complaints || complaints.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Complaints</h3>
            <p className="text-muted-foreground">You haven't submitted any complaints yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <Card key={complaint._id || complaint.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle>{complaint.title}</CardTitle>
                      <Badge variant={getPriorityColor(complaint.priority) as any} className="capitalize">{complaint.priority}</Badge>
                      <Badge variant="outline" className="capitalize">{complaint.category}</Badge>
                    </div>
                    <CardDescription>{new Date(complaint.createdAt).toLocaleDateString()}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(complaint.status) as any} className="capitalize">{complaint.status}</Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                      onClick={() => handleDeleteClick(complaint._id || complaint.id!)}
                      disabled={deletingId === (complaint._id || complaint.id)}
                    >
                      {deletingId === (complaint._id || complaint.id) ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground whitespace-pre-wrap">{complaint.description}</p>
                {complaint.resolution && (
                  <div className="mt-4 p-4 bg-muted rounded-md">
                    <p className="text-sm font-semibold mb-1">Resolution:</p>
                    <p className="text-sm text-muted-foreground">{complaint.resolution}</p>
                    {complaint.resolvedAt && (
                      <p className="text-xs text-muted-foreground mt-2">Resolved on: {new Date(complaint.resolvedAt).toLocaleDateString()}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteConfirmationId} onOpenChange={(open) => !open && setDeleteConfirmationId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your complaint.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!deletingId}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={!!deletingId}
            >
              {deletingId ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Complaints;
