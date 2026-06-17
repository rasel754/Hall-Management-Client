import React, { useEffect, useState, useMemo } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { EmptyState } from "@/components/ui/empty-state";
import { adminService } from "@/services/admin.service";
import { Notice } from "@/services/student.service";
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
import { Bell, Plus, Edit, Trash2, Loader2, Calendar, User, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const noticeSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  category: z.enum(["general", "urgent", "academic", "maintenance"], {
    errorMap: () => ({ message: "Select category rating" }),
  }),
});

type NoticeFormValues = z.infer<typeof noticeSchema>;

export default function MakeNotice() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal controls
  const [noticeModalOpen, setRoomModalOpen] = useState(false);
  const [editNoticeTarget, setEditNoticeTarget] = useState<Notice | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [processing, setProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<NoticeFormValues>({
    resolver: zodResolver(noticeSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "general",
    },
  });

  useEffect(() => {
    register("category");
  }, [register]);

  const watchedTitle = watch("title") || "Untitled Notice";
  const watchedContent = watch("content") || "No content written yet...";
  const watchedCategory = watch("category") || "general";

  const fetchNotices = async () => {
    try {
      const res = await adminService.getAllNotices();
      setNotices(res.data || res || []);
    } catch (err) {
      toast.error((err as any).response?.data?.message || "Failed to load notice databases.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleOpenAddNotice = () => {
    setEditNoticeTarget(null);
    setPreviewMode(false);
    reset({
      title: "",
      content: "",
      category: "general",
    });
    setRoomModalOpen(true);
  };

  const handleOpenEditNotice = (n: Notice) => {
    setEditNoticeTarget(n);
    setPreviewMode(false);
    reset({
      title: n.title,
      content: n.content,
      category: n.category || "general",
    });
    setRoomModalOpen(true);
  };

  const handleConfirmNoticeSave = async (data: NoticeFormValues) => {
    setProcessing(true);
    try {
      if (editNoticeTarget) {
        // Edit Notice
        await adminService.updateNotice(editNoticeTarget._id || editNoticeTarget.id || "", {
          title: data.title,
          content: data.content,
          category: data.category,
        });
        toast.success("Notice updated successfully!");
      } else {
        // Add Notice
        await adminService.createNotice({
          title: data.title,
          content: data.content,
          category: data.category,
          targetAudience: ["student"],
          isActive: true,
        });
        toast.success("Notice published successfully!");
      }
      setRoomModalOpen(false);
      fetchNotices();
    } catch (err) {
      const errorMsg = (err as any).response?.data?.message || (err as any).message || "Failed to publish notice circular.";
      toast.error(errorMsg);
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
  };

  const handleConfirmNoticeDelete = async () => {
    if (!deleteTargetId) return;
    setProcessing(true);
    try {
      await adminService.deleteNotice(deleteTargetId);
      toast.success("Notice deleted successfully.");
      setDeleteTargetId(null);
      fetchNotices();
    } catch (err) {
      toast.error((err as any).response?.data?.message || "Failed to delete notice.");
    } finally {
      setProcessing(false);
    }
  };

  const columns: Column<Notice>[] = [
    {
      header: "Notice Title",
      accessorKey: "title",
      cell: (row) => <span className="font-bold text-foreground line-clamp-1">{row.title}</span>,
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: (row) => <StatusBadge status={row.category} />,
    },
    {
      header: "Date Published",
      accessorKey: "createdAt",
      cell: (row) => (
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Creator",
      cell: (row) => (
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <User className="h-3.5 w-3.5" />
          {row.createdBy ? `${row.createdBy.firstName} ${row.createdBy.lastName}` : "Warden Admin"}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleOpenEditNotice(row)}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-primary hover:bg-primary/5 rounded-md"
            title="Edit Notice"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => handleDeleteClick(row._id || row.id || "")}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-md"
            title="Delete Notice"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Make Notices"
        subtitle="Manage academic circulars, emergency announcements, and general news postings."
        action={
          <Button onClick={handleOpenAddNotice} className="rounded-lg h-10 px-4 font-semibold flex items-center gap-1.5">
            <Plus className="h-4 w-4" />
            Publish Notice
          </Button>
        }
      />

      {loading ? (
        <Card className="p-12"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /></Card>
      ) : notices.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notices published"
          description="There are currently no notice circulars logged in the system catalog database."
          action={
            <Button onClick={handleOpenAddNotice} className="rounded-lg">
              Publish Notice
            </Button>
          }
        />
      ) : (
        <Card className="border-border bg-card shadow-md rounded-xl p-6">
          <DataTable
            columns={columns}
            data={notices}
            searchKey="title"
            searchPlaceholder="Search notices by title..."
            paginated={true}
            pageSize={10}
          />
        </Card>
      )}

      {/* Notice Form & Preview Dialog Modal */}
      {noticeModalOpen && (
        <Dialog open={noticeModalOpen} onOpenChange={(open) => !open && setRoomModalOpen(false)}>
          <DialogContent className="sm:max-w-[540px] rounded-xl bg-card border-border">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-bold">
                  {editNoticeTarget ? "Edit Notice Details" : "Publish Official Notice"}
                </DialogTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="rounded-lg text-xs h-8 px-2 flex items-center gap-1 border-border bg-card"
                >
                  <Eye className="h-3.5 w-3.5" />
                  {previewMode ? "Edit Form" : "Live Preview"}
                </Button>
              </div>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Notice will be visible immediately to all students on notice boards.
              </DialogDescription>
            </DialogHeader>

            {previewMode ? (
              /* Live Preview Mode Pane */
              <div className="my-6 p-4 border border-dashed border-border rounded-xl bg-muted/20 space-y-4">
                <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                  <StatusBadge status={watchedCategory} />
                  <span>Today's Date</span>
                </div>
                <h3 className="text-base font-bold text-foreground leading-tight">{watchedTitle}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">{watchedContent}</p>
                <div className="pt-2 border-t border-border flex justify-end text-[10px] text-muted-foreground">
                  <span>Authorized Administrator Warden</span>
                </div>
              </div>
            ) : (
              /* Form Mode Pane */
              <form onSubmit={handleSubmit(handleConfirmNoticeSave)} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="notice-title">Notice Title</Label>
                  <Input
                    id="notice-title"
                    placeholder="e.g., Annual Sports Tournament Schedule"
                    {...register("title")}
                    className={errors.title ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                    disabled={processing}
                    required
                  />
                  {errors.title && (
                    <p className="text-xs text-destructive">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notice-category">Notice Category</Label>
                  <Select
                    value={watch("category")}
                    onValueChange={(val) => setValue("category", val as any)}
                  >
                    <SelectTrigger id="notice-category" className="w-full bg-card rounded-lg h-10 border-border">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-xs text-destructive">{errors.category.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notice-content">Circular Content</Label>
                  <Textarea
                    id="notice-content"
                    placeholder="Type notice announcements details here..."
                    rows={6}
                    {...register("content")}
                    className={errors.content ? "border-destructive focus-visible:ring-destructive rounded-lg" : "rounded-lg"}
                    disabled={processing}
                    required
                  />
                  {errors.content && (
                    <p className="text-xs text-destructive">{errors.content.message}</p>
                  )}
                </div>

                <DialogFooter className="mt-6">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setRoomModalOpen(false)}
                    disabled={processing}
                    className="rounded-lg text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={processing}
                    className="rounded-lg text-xs font-semibold px-4 flex items-center gap-1.5"
                  >
                    {processing && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    {editNoticeTarget ? "Save Changes" : "Publish Circular"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <ConfirmModal
          title="Delete Notice Circular"
          message="Are you sure you want to delete this notice circular? It will delete the announcement from all student notice boards immediately."
          isOpen={!!deleteTargetId}
          onClose={() => setDeleteTargetId(null)}
          onConfirm={handleConfirmNoticeDelete}
          confirmText="Delete Notice"
          cancelText="Cancel"
          isDestructive={true}
          isLoading={processing}
        />
      )}
    </div>
  );
}
