import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";

interface Complaint {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  status: string;
  studentId?: string;
  createdAt: string;
}

const SolveComplaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [solvingId, setSolvingId] = useState<string | null>(null);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      // Using student service as placeholder - backend should have admin complaint endpoint
      const response = await adminService.getDashboard();
      setComplaints([]);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsSolved = async (complaintId: string, title: string) => {
    setSolvingId(complaintId);
    try {
      const response = await adminService.solveComplaint(complaintId);
      if (response.success) {
        toast.success("Complaint marked as resolved", {
          description: response.message || `"${title}" has been successfully resolved.`,
        });
        loadComplaints();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to resolve complaint");
    } finally {
      setSolvingId(null);
    }
  };

  const pendingComplaints = complaints.filter((c) => c.status !== "Solved" && c.status !== "resolved");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Solve Complaints</h1>
        <p className="text-muted-foreground mt-2">Review and resolve student complaints</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Complaints ({pendingComplaints.length})</CardTitle>
          <CardDescription>Complaints that need attention</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pendingComplaints.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground">No pending complaints at the moment.</p>
            </div>
          ) : (
            pendingComplaints.map((complaint) => {
              const complaintId = complaint._id || complaint.id || "";
              const isSolving = solvingId === complaintId;
              
              return (
                <Card key={complaintId}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="mb-2">{complaint.title}</CardTitle>
                        <CardDescription>{new Date(complaint.createdAt).toLocaleDateString()}</CardDescription>
                      </div>
                      <Badge variant="secondary">{complaint.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{complaint.description}</p>
                    <Button size="sm" onClick={() => handleMarkAsSolved(complaintId, complaint.title)} disabled={isSolving}>
                      {isSolving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Solving...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Mark as Solved
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SolveComplaints;
