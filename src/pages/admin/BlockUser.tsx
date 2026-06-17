import React, { useEffect, useState, useMemo } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { EmptyState } from "@/components/ui/empty-state";
import { adminService } from "@/services/admin.service";
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
import { Users, UserX, UserCheck, Loader2, ShieldAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

interface UserRecord {
  _id: string;
  name: string;
  email: string;
  role: string;
  blocked?: boolean;
}

const blockSchema = z.object({
  blockReason: z.string().min(5, "Suspension reason must be at least 5 characters"),
});

type BlockFormValues = z.infer<typeof blockSchema>;

export default function BlockUser() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [blockTarget, setBlockTarget] = useState<UserRecord | null>(null);
  const [unblockTarget, setUnblockTarget] = useState<UserRecord | null>(null);
  const [processing, setProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BlockFormValues>({
    resolver: zodResolver(blockSchema),
  });

  const fetchUsers = async () => {
    try {
      const res = await adminService.getAllUsers();
      setUsers(res.data || res || []);
    } catch (err) {
      toast.error((err as any).response?.data?.message || "Failed to load user directories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlockActionSubmit = async (data: BlockFormValues) => {
    if (!blockTarget) return;
    setProcessing(true);
    try {
      await adminService.blockUser(blockTarget._id, data.blockReason);
      toast.success(`Account ${blockTarget.email} blocked successfully.`);
      setBlockTarget(null);
      fetchUsers();
    } catch (err) {
      toast.error((err as any).response?.data?.message || "Failed to block user.");
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirmUnblock = async () => {
    if (!unblockTarget) return;
    setProcessing(true);
    try {
      await adminService.activateUser(unblockTarget._id);
      toast.success(`Account ${unblockTarget.email} activated successfully!`);
      setUnblockTarget(null);
      fetchUsers();
    } catch (err) {
      toast.error((err as any).response?.data?.message || "Failed to unblock user.");
    } finally {
      setProcessing(false);
    }
  };

  const columns: Column<UserRecord>[] = [
    {
      header: "Account User",
      accessorKey: "name",
      cell: (row) => (
        <div className="space-y-0.5">
          <div className="font-bold text-foreground">{row.name}</div>
          <div className="text-xs text-muted-foreground">{row.email}</div>
        </div>
      ),
    },
    {
      header: "Portal Role",
      accessorKey: "role",
      cell: (row) => (
        <span className="text-xs font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded-full capitalize">
          {row.role}
        </span>
      ),
    },
    {
      header: "Account status",
      cell: (row) => <StatusBadge status={row.blocked ? "blocked" : "active"} />,
    },
    {
      header: "Status Toggle Action",
      cell: (row) => {
        if (row.role === "admin") return null; // Avoid self deactivation
        if (row.blocked) {
          return (
            <Button
              onClick={() => setUnblockTarget(row)}
              size="sm"
              className="h-8 rounded-lg text-xs font-semibold px-3 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1"
            >
              <UserCheck className="h-3.5 w-3.5" />
              Unblock Account
            </Button>
          );
        }
        return (
          <Button
            onClick={() => {
              setBlockTarget(row);
              reset({ blockReason: "" });
            }}
            variant="destructive"
            size="sm"
            className="h-8 rounded-lg text-xs font-semibold px-3 flex items-center gap-1"
          >
            <UserX className="h-3.5 w-3.5" />
            Block Account
          </Button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Block Accounts"
        subtitle="Deactivate student portal access profiles for rules or payment defaults."
      />

      {loading ? (
        <Card className="p-12"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /></Card>
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users registered"
          description="There are currently no registration logs in the database."
        />
      ) : (
        <Card className="border-border bg-card shadow-md rounded-xl p-6">
          <DataTable
            columns={columns}
            data={users}
            searchKey="name"
            searchPlaceholder="Search accounts by name..."
            filterKey="blocked"
            filterOptions={[
              { label: "Active Accounts Only", value: "false" },
              { label: "Blocked Accounts Only", value: "true" },
            ]}
            paginated={true}
            pageSize={10}
          />
        </Card>
      )}

      {/* Block Reason Form Dialog Modal */}
      {blockTarget && (
        <Dialog open={!!blockTarget} onOpenChange={(open) => !open && setBlockTarget(null)}>
          <DialogContent className="sm:max-w-[420px] rounded-xl bg-card border-border">
            <DialogHeader>
              <div className="flex items-center gap-2 text-destructive">
                <ShieldAlert className="h-6 w-6" />
                <DialogTitle className="text-lg font-bold">Block Account Access</DialogTitle>
              </div>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Suspends access for student <span className="font-semibold text-foreground">{blockTarget.email}</span>.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(handleBlockActionSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="block-reason-input">Reason for Suspension</Label>
                <Input
                  id="block-reason-input"
                  placeholder="e.g., Unpaid rent fees for consecutive 3 months"
                  {...register("blockReason")}
                  className={errors.blockReason ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                  disabled={processing}
                  required
                />
                {errors.blockReason && (
                  <p className="text-xs text-destructive">{errors.blockReason.message}</p>
                )}
              </div>

              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setBlockTarget(null)}
                  disabled={processing}
                  className="rounded-lg text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={processing}
                  className="rounded-lg text-xs font-semibold px-4 flex items-center gap-1.5"
                >
                  {processing && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Confirm Block
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Unblock Confirmation Modal */}
      {unblockTarget && (
        <ConfirmModal
          title="Unblock Account Access"
          message={`Are you sure you want to activate the account for student ${unblockTarget.name}? This will restore access to their student portal dashboard.`}
          isOpen={!!unblockTarget}
          onClose={() => setUnblockTarget(null)}
          onConfirm={handleConfirmUnblock}
          confirmText="Yes, Unblock"
          cancelText="Cancel"
          isDestructive={false}
          isLoading={processing}
        />
      )}
    </div>
  );
}
