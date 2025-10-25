import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockComplaints, Complaint } from "@/data/complaints";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

const SolveComplaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);

  const handleMarkAsSolved = (complaintId: string, title: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId ? { ...c, status: "resolved", resolvedAt: new Date().toISOString() } : c
      )
    );

    toast.success("Complaint marked as resolved", {
      description: `"${title}" has been successfully resolved.`,
    });
  };

  const pendingComplaints = complaints.filter((c) => c.status !== "resolved");
  const resolvedComplaints = complaints.filter((c) => c.status === "resolved");

  const getStatusColor = (status: Complaint["status"]) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "in-progress":
        return "default";
      case "resolved":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getPriorityColor = (priority: Complaint["priority"]) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Solve Complaints</h1>
        <p className="text-muted-foreground mt-2">Review and resolve student complaints</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complaints.filter((c) => c.status === "pending").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complaints.filter((c) => c.status === "in-progress").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedComplaints.length}</div>
          </CardContent>
        </Card>
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
            pendingComplaints.map((complaint) => (
              <Card key={complaint.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="mb-2">{complaint.title}</CardTitle>
                      <CardDescription>
                        By {complaint.studentName} • {new Date(complaint.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={getStatusColor(complaint.status)}>{complaint.status}</Badge>
                      <Badge variant={getPriorityColor(complaint.priority)}>{complaint.priority}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{complaint.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {complaint.category}
                    </Badge>
                    {complaint.status !== "resolved" && (
                      <Button size="sm" onClick={() => handleMarkAsSolved(complaint.id, complaint.title)}>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark as Solved
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      {resolvedComplaints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resolved Complaints ({resolvedComplaints.length})</CardTitle>
            <CardDescription>Recently resolved issues</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {resolvedComplaints.map((complaint) => (
              <div key={complaint.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{complaint.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Resolved on {new Date(complaint.resolvedAt!).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="outline">resolved</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SolveComplaints;
