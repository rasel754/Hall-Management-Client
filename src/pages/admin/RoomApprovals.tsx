import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { EmptyState } from "@/components/ui/empty-state";
import { adminService } from "@/services/admin.service";
import { useAdminStats } from "@/hooks/useAdminStats";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Calendar, User, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

interface BookingItem {
  _id: string;
  studentId?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    studentId?: string;
  };
  roomId?: {
    roomNumber?: string;
    number?: string;
    floor?: number;
  };
  hallId?: {
    name?: string;
  };
  status: string;
  startDate?: string;
  createdAt?: string;
}

export default function RoomApprovals() {
  const { bookings, isLoadingBookings, refetchBookings, approveBooking, rejectBooking } = useAdminStats();

  const [selectedRows, setSelectedRows] = useState<BookingItem[]>([]);
  
  // Modals state
  const [modalType, setModalType] = useState<"approve" | "reject" | null>(null);
  const [singleTarget, setSingleTarget] = useState<BookingItem | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleActionClick = (item: BookingItem, type: "approve" | "reject") => {
    setSingleTarget(item);
    setModalType(type);
  };

  const handleBulkActionClick = (type: "approve" | "reject") => {
    setSingleTarget(null);
    setModalType(type);
  };

  const handleConfirmDecision = async () => {
    setProcessing(true);
    try {
      if (singleTarget) {
        // Single row decision
        if (modalType === "approve") {
          await approveBooking(singleTarget._id);
        } else {
          await rejectBooking(singleTarget._id);
        }
      } else {
        // Bulk actions
        const promises = selectedRows.map((row) =>
          modalType === "approve"
            ? adminService.approveRoomBooking(row._id)
            : adminService.rejectRoomBooking(row._id)
        );
        await Promise.all(promises);
        toast.success(`Bulk decision applied to ${selectedRows.length} requests!`);
        refetchBookings();
        setSelectedRows([]);
      }
      setModalType(null);
      setSingleTarget(null);
    } catch (err) {
      console.error(err);
      toast.error((err as any).response?.data?.message || "Failed to execute booking status change.");
    } finally {
      setProcessing(false);
    }
  };

  const columns: Column<BookingItem>[] = [
    {
      header: "Student Profile",
      cell: (row) => {
        const name = row.studentId
          ? `${row.studentId.firstName} ${row.studentId.lastName}`
          : "Unknown Student";
        return (
          <div className="space-y-0.5">
            <div className="font-bold text-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-primary" />
              {name}
            </div>
            <div className="text-[10px] text-muted-foreground">{row.studentId?.email}</div>
          </div>
        );
      },
    },
    {
      header: "Requested Seat",
      cell: (row) => (
        <div className="space-y-0.5">
          <div className="font-semibold text-foreground">
            Room {row.roomId?.roomNumber || row.roomId?.number || "Requested"}
          </div>
          <div className="text-[10px] text-muted-foreground">{row.hallId?.name || "Student Hall"}</div>
        </div>
      ),
    },
    {
      header: "Requested Date",
      cell: (row) => (
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {new Date(row.startDate || row.createdAt || Date.now()).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Approvals Actions",
      cell: (row) => {
        if (row.status !== "pending") return null;
        return (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => handleActionClick(row, "approve")}
              size="sm"
              className="h-8 rounded-lg text-xs font-semibold px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Approve
            </Button>
            <Button
              onClick={() => handleActionClick(row, "reject")}
              variant="outline"
              size="sm"
              className="h-8 rounded-lg text-xs font-semibold px-2.5 border-destructive/20 hover:bg-destructive/10 text-destructive flex items-center gap-1"
            >
              <XCircle className="h-3.5 w-3.5" />
              Reject
            </Button>
          </div>
        );
      },
    },
  ];

  const filterOptions = [
    { label: "Pending Requests", value: "pending" },
    { label: "Approved Bookings", value: "approved" },
    { label: "Rejected Requests", value: "rejected" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Room Approvals"
        subtitle="Review, approve, or reject student residence hall seat applications."
      />

      {isLoadingBookings ? (
        <Card className="p-12"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /></Card>
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={ShieldAlert}
          title="No booking requests queued"
          description="There are currently no room booking requests logged in the database."
        />
      ) : (
        <Card className="border-border bg-card shadow-md rounded-xl p-6">
          <DataTable
            columns={columns}
            data={bookings}
            searchKey="studentId.firstName" // Client search path
            searchPlaceholder="Search student name..."
            filterKey="status"
            filterOptions={filterOptions}
            enableSelection={true}
            onSelectionChange={(rows) => setSelectedRows(rows.filter((r) => r.status === "pending"))}
            bulkActions={
              <div className="flex gap-2">
                <Button
                  onClick={() => handleBulkActionClick("approve")}
                  size="sm"
                  className="h-7 text-[10px] rounded-md bg-emerald-600 hover:bg-emerald-700 font-semibold text-white"
                >
                  Approve Selected
                </Button>
                <Button
                  onClick={() => handleBulkActionClick("reject")}
                  variant="destructive"
                  size="sm"
                  className="h-7 text-[10px] rounded-md font-semibold"
                >
                  Reject Selected
                </Button>
              </div>
            }
            paginated={true}
            pageSize={10}
          />
        </Card>
      )}

      {/* Decision confirmation modal */}
      {modalType && (
        <ConfirmModal
          title={
            modalType === "approve"
              ? singleTarget
                ? "Approve Seat Reservation?"
                : `Approve ${selectedRows.length} Seat Reservations?`
              : singleTarget
              ? "Reject Seat Reservation?"
              : `Reject ${selectedRows.length} Seat Reservations?`
          }
          message={
            modalType === "approve"
              ? singleTarget
                ? "Are you sure you want to approve this seat allocation request? The student will be assigned to the room."
                : `Are you sure you want to approve all ${selectedRows.length} selected seat requests?`
              : singleTarget
              ? "Are you sure you want to reject this request? The student will be notified of the decision."
              : `Are you sure you want to reject all ${selectedRows.length} selected requests?`
          }
          isOpen={!!modalType}
          onClose={() => {
            setModalType(null);
            setSingleTarget(null);
          }}
          onConfirm={handleConfirmDecision}
          confirmText={modalType === "approve" ? "Confirm Approval" : "Confirm Rejection"}
          cancelText="Cancel"
          isDestructive={modalType === "reject"}
          isLoading={processing}
        />
      )}
    </div>
  );
}
