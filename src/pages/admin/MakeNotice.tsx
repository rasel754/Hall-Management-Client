import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { Send, Loader2, AlertCircle, Plus, Pencil, Trash2, Calendar, ClipboardList } from "lucide-react";

interface Notice {
  _id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetAudience: ('admin' | 'student')[];
  createdAt: string;
  isActive: boolean;
}

const MakeNotice = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "medium" as 'low' | 'medium' | 'high' | 'urgent',
    targetAudience: ['student'] as ('admin' | 'student')[],
  });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllNotices();


      let noticesData: Notice[] = [];

      // Handle various response structures
      if (Array.isArray(response)) {
        noticesData = response;
      } else if (response && Array.isArray(response.data)) {
        noticesData = response.data;
      } else if (response?.data && Array.isArray(response.data.data)) {
        noticesData = response.data.data;
      } else if (response?.data && Array.isArray(response.data.notices)) {
        // This matches the user's console output: { data: { notices: [] } }
        noticesData = response.data.notices;
      } else if (response && Array.isArray(response.notices)) {
        noticesData = response.notices;
      } else {
        console.warn("Could not find array in response, defaulting to empty", response);
      }

      setNotices(noticesData || []);
    } catch (error) {
      console.error("Error fetching notices:", error);
      toast.error("Failed to fetch notices");
      setNotices([]); // Ensure array on error
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      priority: "medium",
      targetAudience: ['student']
    });
    setSelectedNotice(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (notice: Notice) => {
    setSelectedNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      priority: notice.priority,
      targetAudience: notice.targetAudience
    });
    setIsDialogOpen(true);
  };

  const handleOpenDelete = (notice: Notice) => {
    setSelectedNotice(notice);
    setIsAlertOpen(true);
  };

  const handleTargetAudienceChange = (role: 'admin' | 'student', checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, targetAudience: [...formData.targetAudience, role] });
    } else {
      setFormData({ ...formData, targetAudience: formData.targetAudience.filter(r => r !== role) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast.error("Missing Required Fields", {
        description: "Please fill in both title and content.",
        icon: <AlertCircle className="h-4 w-4" />,
      });
      return;
    }

    if (formData.targetAudience.length === 0) {
      toast.error("Select Target Audience", {
        description: "Please select at least one target audience.",
        icon: <AlertCircle className="h-4 w-4" />,
      });
      return;
    }

    setSubmitting(true);

    try {
      let response;
      if (selectedNotice) {
        // Update existing notice
        response = await adminService.updateNotice(selectedNotice._id, formData);
        toast.success("Notice Updated Successfully");
      } else {
        // Create new notice
        response = await adminService.createNotice(formData);
        toast.success("Notice Published Successfully! 🎉", {
          description: `"${formData.title}" has been sent.`,
        });
      }

      setIsDialogOpen(false);
      fetchNotices();
      resetForm();
    } catch (error: any) {
      console.error('Notice operation error:', error);
      const errorMessage = error.response?.data?.message || "An error occurred.";
      toast.error(selectedNotice ? "Failed to Update Notice" : "Failed to Publish Notice", {
        description: errorMessage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedNotice) return;

    try {
      await adminService.deleteNotice(selectedNotice._id);
      toast.success("Notice Deleted Successfully");
      setNotices(notices.filter(n => n._id !== selectedNotice._id));
      setIsAlertOpen(false);
      setSelectedNotice(null);
    } catch (error) {
      console.error("Error deleting notice:", error);
      toast.error("Failed to delete notice");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'low': return 'text-gray-600 bg-gray-100 border-gray-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notice Board</h1>
          <p className="text-muted-foreground mt-2">Manage announcements for students and staff</p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Create Notice
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : notices.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <div className="bg-muted/50 p-4 rounded-full mb-4">
            <ClipboardList className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Notices Yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Create your first notice to communicate with students and staff members.
          </p>
          <Button onClick={handleOpenCreate}>Create Notice</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notices.map((notice) => (
            <Card key={notice._id} className="flex flex-col overflow-hidden transition-all hover:shadow-md">
              <div className={`h-1.5 w-full ${notice.priority === 'urgent' ? 'bg-red-500' :
                notice.priority === 'high' ? 'bg-orange-500' :
                  notice.priority === 'medium' ? 'bg-blue-500' : 'bg-gray-400'
                }`} />
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getPriorityColor(notice.priority)}`}>
                      {notice.priority}
                    </span>
                    <CardTitle className="leading-tight pt-2 line-clamp-2" title={notice.title}>
                      {notice.title}
                    </CardTitle>
                  </div>
                </div>
                <CardDescription className="flex items-center gap-2 text-xs pt-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(notice.createdAt)}
                  <span className="mx-1">•</span>
                  Target: {notice.targetAudience.join(', ')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-4">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap max-h-[200px] overflow-y-auto pr-2">
                  {notice.content}
                </p>
              </CardContent>
              <div className="flex items-center gap-2 p-4 pt-0 mt-auto border-t bg-muted/20 px-6 py-3">
                <Button variant="ghost" size="sm" className="flex-1 h-8 text-muted-foreground hover:text-primary" onClick={() => handleOpenEdit(notice)}>
                  <Pencil className="h-3.5 w-3.5 mr-2" /> Edit
                </Button>
                <div className="w-[1px] h-4 bg-border"></div>
                <Button variant="ghost" size="sm" className="flex-1 h-8 text-muted-foreground hover:text-red-600" onClick={() => handleOpenDelete(notice)}>
                  <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedNotice ? "Edit Notice" : "Create New Notice"}</DialogTitle>
            <DialogDescription>
              {selectedNotice ? "Update the details of the notice below." : "Fill in the details to publish a new notice."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Notice Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter a clear and concise title"
                required
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Notice Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Provide detailed information..."
                rows={6}
                required
                disabled={submitting}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level *</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') =>
                    setFormData({ ...formData, priority: value })
                  }
                  disabled={submitting}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Target Audience *</Label>
                <div className="flex flex-col space-y-2 pt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="target-student"
                      checked={formData.targetAudience.includes('student')}
                      onCheckedChange={(checked) => handleTargetAudienceChange('student', checked as boolean)}
                      disabled={submitting}
                    />
                    <label htmlFor="target-student" className="text-sm font-medium leading-none cursor-pointer">
                      Students
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="target-admin"
                      checked={formData.targetAudience.includes('admin')}
                      onCheckedChange={(checked) => handleTargetAudienceChange('admin', checked as boolean)}
                      disabled={submitting}
                    />
                    <label htmlFor="target-admin" className="text-sm font-medium leading-none cursor-pointer">
                      Admins
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {selectedNotice ? "Updating..." : "Publishing..."}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {selectedNotice ? "Update Notice" : "Publish Notice"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the notice
              "{selectedNotice?.title}" and remove it from everyone's view.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete Notice
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MakeNotice;
