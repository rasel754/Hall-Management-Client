import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { EmptyState } from "@/components/ui/empty-state";
import { useRoomBooking } from "@/hooks/useRoomBooking";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShieldAlert, AlertTriangle, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const cancelSchema = z.object({
  reason: z.string().min(1, "Please select a reason for leaving"),
  details: z.string().min(10, "Please provide at least 10 characters explaining your cancellation"),
});

type CancelFormValues = z.infer<typeof cancelSchema>;

export default function CancelSeat() {
  const navigate = useNavigate();
  const { myRoom, isLoadingRoom } = useStudentProfile();
  const { bookings, cancelBooking, isCancelling } = useRoomBooking();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formData, setFormData] = useState<CancelFormValues | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CancelFormValues>({
    resolver: zodResolver(cancelSchema),
  });

  // Find the active approved booking to cancel
  const activeBooking = bookings.find((b: any) => b.status === "approved" || b.status === "active");

  const onSubmit = (data: CancelFormValues) => {
    setFormData(data);
    setConfirmOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!activeBooking || !formData) return;
    setConfirmOpen(false);
    try {
      await cancelBooking({
        bookingId: activeBooking._id || activeBooking.id,
        data: {
          reason: formData.reason,
          details: formData.details,
        },
      });
      toast.success("Cancellation petition submitted successfully!");
      navigate("/dashboard/student/overview");
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoadingRoom) {
    return (
      <div className="space-y-6">
        <PageHeader title="Cancel Seat" subtitle="Checking room allocations..." />
        <Card className="p-8"><Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" /></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Seat Cancellation"
        subtitle="Request to checkout or release your assigned hall seat."
      />

      {!myRoom || !activeBooking ? (
        <EmptyState
          icon={ShieldAlert}
          title="No active seat allocation found"
          description="You do not currently occupy an approved hall seat. Cancellation is only available for active room contracts."
        />
      ) : (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
          {/* Booking Summary */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border-border bg-card shadow-md rounded-xl">
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-base font-bold">Active Contract Details</CardTitle>
                <CardDescription>Your current housing record</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Room Number</span>
                  <span className="font-semibold text-foreground">Room {myRoom.roomNumber || myRoom.number}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Room Type</span>
                  <span className="font-semibold text-foreground">{myRoom.type || "Double Shared"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Allocation Date</span>
                  <span className="font-semibold text-foreground">
                    {new Date(activeBooking.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Monthly Rent</span>
                  <span className="font-semibold text-primary">
                    ${myRoom.pricePerMonth || myRoom.price || 2200}/mo
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card shadow-md rounded-xl bg-destructive/5 border-destructive/10">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-destructive font-bold text-sm">
                  <AlertTriangle className="h-5 w-5" />
                  <h4>Critical Warning</h4>
                </div>
                <p className="text-xs text-destructive leading-relaxed">
                  Cancelling your room contract cannot be undone. Once submitted, your seat will be marked as vacant and put back up for public booking. You must vacate the premises and return room keys to the office within 72 hours of approval.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Cancellation Request Form */}
          <div className="lg:col-span-7">
            <Card className="border-border bg-card shadow-md rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Checkout Application</CardTitle>
                <CardDescription>Specify details regarding your checkout request</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cancel-reason">Reason for Checkout</Label>
                    <Select
                      value={watch("reason")}
                      onValueChange={(val) => setValue("reason", val)}
                    >
                      <SelectTrigger id="cancel-reason" className="w-full bg-card rounded-lg h-10 border-border">
                        <SelectValue placeholder="Select a reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="graduation">Graduation / Course Completion</SelectItem>
                        <SelectItem value="transfer">Transferring to Another Hall</SelectItem>
                        <SelectItem value="off_campus">Moving to Off-Campus Housing</SelectItem>
                        <SelectItem value="financial">Financial Constraints</SelectItem>
                        <SelectItem value="other">Other Personal Reasons</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.reason && (
                      <p className="text-xs text-destructive">{errors.reason.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cancel-details">Explanation details</Label>
                    <Textarea
                      id="cancel-details"
                      placeholder="Please elaborate on your reason for vacating the room..."
                      rows={5}
                      {...register("details")}
                      className={errors.details ? "border-destructive focus-visible:ring-destructive rounded-lg" : "rounded-lg"}
                      disabled={isCancelling}
                    />
                    {errors.details && (
                      <p className="text-xs text-destructive">{errors.details.message}</p>
                    )}
                  </div>

                  <Button type="submit" variant="destructive" disabled={isCancelling} className="w-full h-10 rounded-lg font-semibold flex items-center justify-center gap-1">
                    {isCancelling && <Loader2 className="h-4 w-4 animate-spin" />}
                    Apply for Cancellation
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Confirmation Dialog Modal */}
      {confirmOpen && (
        <ConfirmModal
          title="Confirm Seat Cancellation"
          message="Are you absolutely sure you want to cancel your seat booking? This action will terminate your housing contract and cannot be undone."
          isOpen={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirmCancel}
          confirmText="Yes, Cancel Seat"
          cancelText="Go Back"
          isDestructive={true}
          isLoading={isCancelling}
        />
      )}
    </div>
  );
}
