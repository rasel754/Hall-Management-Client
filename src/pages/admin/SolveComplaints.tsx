import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Complaint {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  status: string;
  priority?: string;
  category?: string;
  studentId?: string | { firstName: string; lastName: string; email: string };
  resolution?: string;
  createdAt: string;
  updatedAt?: string;
}


const SolveComplaints = () => {
  // State for solving dialog
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const [solvingId, setSolvingId] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllComplaints();

      if (Array.isArray(response)) {
        setComplaints(response);
      } else if (response.data && Array.isArray(response.data.complaints)) {
        setComplaints(response.data.complaints);
      } else if (response.complaints && Array.isArray(response.complaints)) {
        setComplaints(response.complaints);
      } else if (Array.isArray(response.data)) {
        setComplaints(response.data);
      } else {
        setComplaints([]);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  const initSolve = (id: string) => {
    setSolvingId(id);
  };

  const handleSolve = async () => {
    if (!solvingId) return;

    setCompleting(true);
    try {
      const response = await adminService.updateComplaintStatus(solvingId, {
        status: "resolved"
      });

      if (response.success || response) {
        toast.success("Complaint resolved successfully");
        setSolvingId(null);
        loadComplaints();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to resolve complaint");
    } finally {
      setCompleting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high": return "destructive";
      case "medium": return "default"; // or a custom warning color
      case "low": return "secondary";
      default: return "outline";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const activeComplaints = complaints.filter(c => c.status === 'pending' || c.status === 'Pending');
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved' || c.status === 'Solved');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Solve Complaints</h1>
        <p className="text-muted-foreground mt-2">Manage and resolve student complaints.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pending Complaints ({activeComplaints.length})</CardTitle>
            <CardDescription>Complaints requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeComplaints.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No pending complaints.</div>
            ) : (
              activeComplaints.map(complaint => (
                <Card key={complaint._id || complaint.id} className="border bg-card/50">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{complaint.title}</CardTitle>
                        <CardDescription>
                          {new Date(complaint.createdAt).toLocaleDateString()} • {complaint.category}
                        </CardDescription>
                      </div>
                      <Badge variant={getPriorityColor(complaint.priority) as any} className="capitalize">
                        {complaint.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{complaint.description}</p>
                    {complaint.studentId && typeof complaint.studentId === 'object' && (
                      <div className="text-xs text-muted-foreground mb-4">
                        From: {(complaint.studentId as any).firstName} {(complaint.studentId as any).lastName} ({(complaint.studentId as any).email})
                      </div>
                    )}
                    <Dialog open={solvingId === (complaint._id || complaint.id)} onOpenChange={(open) => !open && setSolvingId(null)}>
                      <DialogTrigger asChild>
                        <Button size="sm" onClick={() => initSolve(complaint._id || complaint.id!)}>
                          <CheckCircle2 className="mr-2 h-4 w-4" /> Resolve
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Resolution</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to mark this complaint as resolved? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4">
                          <Button variant="outline" onClick={() => setSolvingId(null)}>Cancel</Button>
                          <Button onClick={handleSolve} disabled={completing}>
                            {completing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirm Resolve
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resolved Complaints ({resolvedComplaints.length})</CardTitle>
            <CardDescription>History of resolved issues</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {resolvedComplaints.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No resolved complaints yet.</div>
            ) : (
              resolvedComplaints.map(complaint => (
                <Card key={complaint._id || complaint.id} className="border bg-muted/20">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base text-muted-foreground line-through">{complaint.title}</CardTitle>
                        <CardDescription>
                          Resolved: {complaint.updatedAt ? new Date(complaint.updatedAt).toLocaleDateString() : '-'}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">Resolved</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {complaint.resolution && (
                      <div className="text-sm bg-muted p-3 rounded-md border text-muted-foreground">
                        <strong>Resolution:</strong> {complaint.resolution}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SolveComplaints;
