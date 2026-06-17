import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { EmptyState } from "@/components/ui/empty-state";
import { useComplaints } from "@/hooks/useComplaints";
import { Complaint } from "@/services/student.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Wrench, CheckCircle, Eye, Calendar, User, ShieldAlert, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SolveComplaints() {
  const { complaints, isLoadingComplaints, resolveComplaintAsync, isResolving } = useComplaints();

  const normalizedComplaints = React.useMemo(() => {
    return complaints.map((c: any) => {
      const studentObj = c.student || c.studentId;
      return {
        ...c,
        studentId: studentObj ? {
          ...studentObj,
          firstName: studentObj.firstName || studentObj.name?.split(" ")[0] || "Student",
          lastName: studentObj.lastName || studentObj.name?.split(" ").slice(1).join(" ") || "",
        } : undefined,
      };
    });
  }, [complaints]);

  // Modals state
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [resolveTarget, setResolveTarget] = useState<Complaint | null>(null);

  const handleResolveConfirm = async () => {
    if (!resolveTarget) return;
    try {
      await resolveComplaintAsync(resolveTarget._id || resolveTarget.id || "");
      setResolveTarget(null);
      setSelectedComplaint(null); // Close detail dialog if open
    } catch (err) {
      console.error(err);
    }
  };

  const columns: Column<Complaint>[] = [
    {
      header: "Student Name",
      cell: (row) => (
        <div className="font-bold text-foreground flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-primary" />
          {row.studentId && typeof row.studentId === "object"
            ? `${(row.studentId as any).firstName} ${(row.studentId as any).lastName}`
            : "Student Housed"}
        </div>
      ),
    },
    {
      header: "Complaint Title",
      accessorKey: "title",
      cell: (row) => <span className="font-semibold text-foreground max-w-xs truncate block">{row.title}</span>,
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: (row) => (
        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">
          {row.category}
        </span>
      ),
    },
    {
      header: "Date Filed",
      accessorKey: "createdAt",
      cell: (row) => (
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Resolution Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setSelectedComplaint(row)}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary hover:bg-primary/5 rounded-md"
            title="Inspect Complaint"
          >
            <Eye className="h-4 w-4" />
          </Button>
          {row.status === "pending" && (
            <Button
              onClick={() => setResolveTarget(row)}
              size="sm"
              className="h-8 rounded-lg text-xs font-semibold px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Resolve
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Resolve Complaints"
        subtitle="Review student complaints, assign technicians, and mark issues as resolved."
      />

      {isLoadingComplaints ? (
        <Card className="p-12"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /></Card>
      ) : complaints.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No complaints submitted"
          description="There are currently no outstanding student complaints logged in the database."
        />
      ) : (
        <Card className="border-border bg-card shadow-md rounded-xl p-6">
          <DataTable
            columns={columns}
            data={normalizedComplaints}
            searchKey="title"
            searchPlaceholder="Search complaint title..."
            filterKey="status"
            filterOptions={[
              { label: "Pending Issues", value: "pending" },
              { label: "Resolved Issues", value: "resolved" },
            ]}
            paginated={true}
            pageSize={10}
          />
        </Card>
      )}

      {/* Detail Dialog Modal */}
      {selectedComplaint && (
        <Dialog open={!!selectedComplaint} onOpenChange={(open) => !open && setSelectedComplaint(null)}>
          <DialogContent className="sm:max-w-[480px] rounded-xl bg-card border-border">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                  {selectedComplaint.category}
                </span>
                <StatusBadge status={selectedComplaint.status} />
              </div>
              <DialogTitle className="text-lg font-bold text-foreground">
                {selectedComplaint.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Filed on {new Date(selectedComplaint.createdAt).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>

            <div className="my-5 space-y-4 text-sm">
              <div className="p-4 bg-muted/20 border border-border rounded-xl">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider block mb-2">Description</span>
                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                  {selectedComplaint.description}
                </p>
              </div>

              {selectedComplaint.studentId && (
                <div className="pt-2">
                  <span className="text-xs text-muted-foreground block">Submitted By Student</span>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-foreground">
                      {typeof selectedComplaint.studentId === "object"
                        ? `${(selectedComplaint.studentId as any).firstName} ${(selectedComplaint.studentId as any).lastName}`
                        : "Campus Student"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button onClick={() => setSelectedComplaint(null)} variant="ghost" className="rounded-lg text-xs h-9">
                Close Inspector
              </Button>
              {selectedComplaint.status === "pending" && (
                <Button
                  onClick={() => setResolveTarget(selectedComplaint)}
                  className="rounded-lg text-xs font-semibold h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
                >
                  <CheckCircle className="h-4 w-4" />
                  Mark as Resolved
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Resolution Confirmation Modal */}
      {resolveTarget && (
        <ConfirmModal
          title="Resolve Complaint Ticket"
          message="Are you sure you want to mark this complaint as resolved? This notifies the student and closes the ticket."
          isOpen={!!resolveTarget}
          onClose={() => setResolveTarget(null)}
          onConfirm={handleResolveConfirm}
          confirmText="Yes, Resolve Issue"
          cancelText="Cancel"
          isLoading={isResolving}
        />
      )}
    </div>
  );
}
