import React, { useEffect, useState, useMemo } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { EmptyState } from "@/components/ui/empty-state";
import { adminService } from "@/services/admin.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Users, Eye, UserX, UserCheck, Loader2, Mail, ShieldAlert, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

interface StudentRecord {
  _id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  studentId?: string;
  department?: string;
  address?: string;
  phoneNumber?: string;
  blocked?: boolean;
  roomId?: {
    roomNumber?: string;
    number?: string;
  } | string;
}

export default function StudentList() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal controls
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [blockTarget, setBlockTarget] = useState<StudentRecord | null>(null);
  const [processing, setProcessing] = useState(false);

  const fetchStudents = async () => {
    try {
      const res = await adminService.getStudents();
      setStudents(res.data || res || []);
    } catch (err) {
      toast.error((err as any).response?.data?.message || "Failed to load student directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleBlockToggle = async () => {
    if (!blockTarget) return;
    setProcessing(true);
    try {
      if (blockTarget.blocked) {
        await adminService.activateUser(blockTarget._id);
        toast.success(`Student ${blockTarget.name} activated successfully!`);
      } else {
        await adminService.blockUser(blockTarget._id);
        toast.success(`Student ${blockTarget.name} blocked successfully!`);
      }
      setBlockTarget(null);
      fetchStudents();
    } catch (err) {
      toast.error((err as any).response?.data?.message || "Failed to execute block status change.");
    } finally {
      setProcessing(false);
    }
  };

  const columns: Column<StudentRecord>[] = [
    {
      header: "Avatar",
      cell: (row) => (
        <Avatar className="h-8 w-8 border border-border">
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
            {row.name ? row.name[0].toUpperCase() : "S"}
          </AvatarFallback>
        </Avatar>
      ),
    },
    {
      header: "Student Name",
      accessorKey: "name",
      cell: (row) => <span className="font-bold text-foreground">{row.name}</span>,
    },
    {
      header: "Student ID",
      accessorKey: "studentId",
      cell: (row) => <span className="font-mono text-xs">{row.studentId || "N/A"}</span>,
    },
    {
      header: "Department",
      accessorKey: "department",
      cell: (row) => <span className="text-xs">{row.department || "Computer Science"}</span>,
    },
    {
      header: "Room Assigned",
      cell: (row) => {
        const roomNo = typeof row.roomId === "object" && row.roomId
          ? row.roomId.roomNumber || row.roomId.number
          : "Not Allocated";
        return (
          <span className={`text-xs font-semibold ${roomNo === "Not Allocated" ? "text-muted-foreground" : "text-primary"}`}>
            {roomNo}
          </span>
        );
      },
    },
    {
      header: "Status",
      cell: (row) => <StatusBadge status={row.blocked ? "blocked" : "active"} />,
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setSelectedStudent(row)}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary hover:bg-primary/5 rounded-md"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setBlockTarget(row)}
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-md ${
              row.blocked ? "text-emerald-500 hover:bg-emerald-500/10" : "text-destructive hover:bg-destructive/10"
            }`}
            title={row.blocked ? "Activate Student" : "Block Student"}
          >
            {row.blocked ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Student Management"
        subtitle="Manage student directories, allocations, department lists, and block statuses."
      />

      {loading ? (
        <Card className="p-12"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /></Card>
      ) : students.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students registered"
          description="There are currently no student records logged in the system database."
        />
      ) : (
        <Card className="border-border bg-card shadow-md rounded-xl p-6">
          <DataTable
            columns={columns}
            data={students}
            searchKey="name"
            searchPlaceholder="Search students by name..."
            filterKey="blocked"
            filterOptions={[
              { label: "Active Directory", value: "false" },
              { label: "Blocked Directory", value: "true" },
            ]}
            paginated={true}
            pageSize={10}
          />
        </Card>
      )}

      {/* Student Details Dialog Modal */}
      {selectedStudent && (
        <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
          <DialogContent className="sm:max-w-[480px] rounded-xl bg-card border-border">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border border-border">
                  <AvatarFallback className="bg-primary/15 text-primary text-lg font-bold">
                    {selectedStudent.name ? selectedStudent.name[0].toUpperCase() : "S"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-lg font-bold text-foreground">
                    {selectedStudent.name}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                    Student Profile Details
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="my-6 space-y-4 text-sm divide-y divide-border">
              <div className="grid grid-cols-2 gap-4 pb-3">
                <div>
                  <span className="text-xs text-muted-foreground block">Student ID</span>
                  <span className="font-semibold text-foreground font-mono">{selectedStudent.studentId || "N/A"}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Department</span>
                  <span className="font-semibold text-foreground">{selectedStudent.department || "Computer Science"}</span>
                </div>
              </div>

              <div className="space-y-2 py-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{selectedStudent.email}</span>
                </div>
                {selectedStudent.phoneNumber && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{selectedStudent.phoneNumber}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{selectedStudent.address || "No Address Logged"}</span>
                </div>
              </div>

              <div className="pt-3">
                <span className="text-xs text-muted-foreground block">Current System Status</span>
                <div className="mt-1">
                  <StatusBadge status={selectedStudent.blocked ? "blocked" : "active"} />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setSelectedStudent(null)} className="rounded-lg text-xs font-semibold h-9">
                Close Profile
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Block Confirm Modal */}
      {blockTarget && (
        <ConfirmModal
          title={blockTarget.blocked ? "Unblock Student Account?" : "Block Student Account?"}
          message={
            blockTarget.blocked
              ? `Are you sure you want to activate the account for student ${blockTarget.name}? This grants dashboard access.`
              : `Are you sure you want to suspend the account for student ${blockTarget.name}? This blocks dashboard log-ins immediately.`
          }
          isOpen={!!blockTarget}
          onClose={() => setBlockTarget(null)}
          onConfirm={handleBlockToggle}
          confirmText={blockTarget.blocked ? "Activate Account" : "Suspend Account"}
          cancelText="Cancel"
          isDestructive={!blockTarget.blocked}
          isLoading={processing}
        />
      )}
    </div>
  );
}
