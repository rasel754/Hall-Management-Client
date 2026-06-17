import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useComplaints } from "@/hooks/useComplaints";
import { Complaint } from "@/services/student.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { MessageSquare, Plus, Loader2, Calendar, FileText, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const complaintSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(20, "Please describe the complaint in at least 20 characters"),
});

type ComplaintFormValues = z.infer<typeof complaintSchema>;

export default function StudentComplaints() {
  const {
    complaints,
    isLoadingComplaints,
    createComplaint,
    isCreating,
    deleteComplaint,
    isDeleting,
  } = useComplaints();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintSchema),
  });

  const onSubmit = async (data: ComplaintFormValues) => {
    try {
      await createComplaint({
        title: data.title,
        category: data.category,
        description: data.description,
        status: "pending",
        priority: "medium",
      });
      setModalOpen(false);
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteComplaint(deleteTargetId);
      setDeleteTargetId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const columns: Column<Complaint>[] = [
    {
      header: "Complaint Title",
      accessorKey: "title",
      cell: (row) => (
        <div className="font-semibold text-foreground max-w-xs truncate">
          {row.title}
        </div>
      ),
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
      header: "Submitted Date",
      accessorKey: "createdAt",
      cell: (row) => (
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar className="h-3 w-3" />
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
      header: "Actions",
      cell: (row) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDeleteClick(row._id || row.id || "")}
          className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-md"
          title="Delete ticket"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const filterOptions = [
    { label: "Pending Tickets", value: "pending" },
    { label: "Resolved Tickets", value: "resolved" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="My Complaints"
        subtitle="Submit maintenance, cleanliness, or safety complaints and monitor resolution tickets."
        action={
          <Button onClick={() => setModalOpen(true)} className="rounded-lg h-10 px-4 font-semibold flex items-center gap-1.5">
            <Plus className="h-4 w-4" />
            New Complaint
          </Button>
        }
      />

      {isLoadingComplaints ? (
        <Card className="p-12"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /></Card>
      ) : complaints.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No complaints submitted"
          description="If you notice any broken appliances, cleanliness issues, or security concerns, file a ticket above."
          action={
            <Button onClick={() => setModalOpen(true)} className="rounded-lg">
              File a Complaint
            </Button>
          }
        />
      ) : (
        <Card className="border-border bg-card shadow-md rounded-xl p-6">
          <DataTable
            columns={columns}
            data={complaints}
            searchKey="title"
            searchPlaceholder="Search complaints by title..."
            filterKey="status"
            filterOptions={filterOptions}
            paginated={true}
            pageSize={8}
          />
        </Card>
      )}

      {/* New Complaint Modal */}
      {modalOpen && (
        <Dialog open={modalOpen} onOpenChange={(open) => !open && setModalOpen(false)}>
          <DialogContent className="sm:max-w-[480px] rounded-xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">File a New Complaint</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Provide details about the issue. Wardens will assign maintenance personnel.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="complaint-title">Brief Title</Label>
                <Input
                  id="complaint-title"
                  placeholder="e.g., Leaking shower head in Bathroom 2"
                  {...register("title")}
                  className={errors.title ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                  disabled={isCreating}
                  required
                />
                {errors.title && (
                  <p className="text-xs text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="complaint-category">Issue Category</Label>
                <Select
                  value={watch("category")}
                  onValueChange={(val) => setValue("category", val)}
                >
                  <SelectTrigger id="complaint-category" className="w-full bg-card rounded-lg h-10 border-border">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">Maintenance & Repairs</SelectItem>
                    <SelectItem value="cleanliness">Cleaning & Janitorial</SelectItem>
                    <SelectItem value="security">Security & Safety</SelectItem>
                    <SelectItem value="noise">Noise & Disturbance</SelectItem>
                    <SelectItem value="other">Other Issues</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-xs text-destructive">{errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="complaint-desc">Describe the Problem</Label>
                <Textarea
                  id="complaint-desc"
                  placeholder="Describe where the issue is, what happened, and any details that can help our team locate it..."
                  rows={4}
                  {...register("description")}
                  className={errors.description ? "border-destructive focus-visible:ring-destructive rounded-lg" : "rounded-lg"}
                  disabled={isCreating}
                  required
                />
                {errors.description && (
                  <p className="text-xs text-destructive">{errors.description.message}</p>
                )}
              </div>

              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setModalOpen(false)}
                  disabled={isCreating}
                  className="rounded-lg text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="rounded-lg text-xs font-semibold px-4"
                >
                  {isCreating && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                  Submit Ticket
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <ConfirmModal
          title="Delete Complaint Ticket"
          message="Are you sure you want to delete this complaint? This ticket history will be permanently cleared."
          isOpen={!!deleteTargetId}
          onClose={() => setDeleteTargetId(null)}
          onConfirm={handleConfirmDelete}
          confirmText="Delete Ticket"
          cancelText="Cancel"
          isDestructive={true}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
