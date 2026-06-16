import React, { useEffect, useState, useMemo } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { studentService, Payment } from "@/services/student.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { CreditCard, Loader2, Download, ArrowUpRight, DollarSign, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { extractErrorMessage } from "@/lib/api";

const paySchema = z.object({
  cardholderName: z.string().min(3, "Cardholder name must be at least 3 characters"),
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be exactly 16 digits"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry must be in MM/YY format"),
  cvv: z.string().regex(/^\d{3}$/, "CVV must be exactly 3 digits"),
});

type PayFormValues = z.infer<typeof paySchema>;

export default function StudentPayment() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePayment, setActivePayment] = useState<Payment | null>(null);
  const [isProcessingPay, setIsProcessingPay] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PayFormValues>({
    resolver: zodResolver(paySchema),
  });

  const fetchPayments = async () => {
    try {
      const res = await studentService.getPayments();
      setPayments(res.data || res || []);
    } catch (err) {
      console.error("Failed to load payments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handlePayClick = (payment: Payment) => {
    setActivePayment(payment);
    reset({
      cardholderName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    });
  };

  const handleClosePay = () => {
    setActivePayment(null);
  };

  const handleConfirmPaySubmit = async (data: PayFormValues) => {
    if (!activePayment) return;
    setIsProcessingPay(true);
    try {
      await studentService.payRent(activePayment._id || activePayment.id || "");
      toast.success(`Rent for ${activePayment.month} cleared successfully!`);
      handleClosePay();
      fetchPayments();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsProcessingPay(false);
    }
  };

  const handleDownloadReceipt = (payment: Payment) => {
    try {
      const content = `-----------------------------------\n` +
                      `        HALLMS RENT RECEIPT        \n` +
                      `-----------------------------------\n` +
                      `Invoice ID: ${payment._id || payment.id}\n` +
                      `Billing Cycle: ${payment.month}\n` +
                      `Amount Cleared: $${payment.amount}\n` +
                      `Status: PAID\n` +
                      `Cleared Date: ${new Date().toLocaleDateString()}\n` +
                      `Thank you for staying at HallMS.\n` +
                      `-----------------------------------`;

      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Receipt_${payment.month}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Receipt downloaded successfully!");
    } catch (err) {
      toast.error("Failed to compile receipt.");
    }
  };

  // Derive billing statistics
  const { totalPaid, amountDue, nextDueMonth } = useMemo(() => {
    let paidAcc = 0;
    let dueAcc = 0;
    let dueMonth = "No pending month";

    payments.forEach((p) => {
      if (p.status === "Paid") {
        paidAcc += p.amount;
      } else {
        dueAcc += p.amount;
        if (dueMonth === "No pending month") {
          dueMonth = p.month;
        }
      }
    });

    return {
      totalPaid: paidAcc,
      amountDue: dueAcc,
      nextDueMonth: dueMonth,
    };
  }, [payments]);

  const columns: Column<Payment>[] = [
    {
      header: "Billing Cycle",
      accessorKey: "month",
      cell: (row) => <span className="font-semibold">{row.month}</span>,
    },
    {
      header: "Amount Due",
      accessorKey: "amount",
      cell: (row) => <span className="text-primary font-bold">${row.amount}</span>,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => <StatusBadge status={row.status === "Paid" ? "paid" : "pending"} />,
    },
    {
      header: "Billing Action",
      cell: (row) => {
        if (row.status === "Paid") {
          return (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownloadReceipt(row)}
              className="h-8 rounded-lg text-xs font-semibold px-2 flex items-center gap-1 bg-card hover:bg-muted/50 border-border"
            >
              <Download className="h-3.5 w-3.5" />
              Receipt
            </Button>
          );
        }
        return (
          <Button
            onClick={() => handlePayClick(row)}
            size="sm"
            className="h-8 rounded-lg text-xs font-semibold px-3 flex items-center gap-1"
          >
            <CreditCard className="h-3.5 w-3.5" />
            Pay Now
          </Button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Student Payments"
        subtitle="Manage outstanding balances, clear monthly rent fees, and retrieve invoice transcripts."
      />

      {/* Summary indicators */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-3">
        <Card className="border-border bg-card shadow-md rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Total Paid</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${totalPaid}</div>
            <p className="text-xs text-muted-foreground mt-0.5">Cleared invoices</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-md rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Amount Due</CardTitle>
            <DollarSign className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${amountDue}</div>
            <p className="text-xs text-muted-foreground mt-0.5">Outstanding balance</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-md rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Next Cycle Due</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{nextDueMonth}</div>
            <p className="text-xs text-muted-foreground mt-0.5">Billing deadline</p>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <Card className="p-12"><Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" /></Card>
      ) : payments.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No billing invoices found"
          description="There are currently no rent logs mapped to your student housing profile."
        />
      ) : (
        <Card className="border-border bg-card shadow-md rounded-xl p-6">
          <DataTable
            columns={columns}
            data={payments}
            searchKey="month"
            searchPlaceholder="Search months..."
            paginated={true}
            pageSize={6}
          />
        </Card>
      )}

      {/* Pay Now Simulated Modal */}
      {activePayment && (
        <Dialog open={!!activePayment} onOpenChange={(open) => !open && handleClosePay()}>
          <DialogContent className="sm:max-w-[420px] rounded-xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Simulated Checkout</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Clearing rent for {activePayment.month} in the amount of ${activePayment.amount}.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(handleConfirmPaySubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="pay-card-name">Cardholder Name</Label>
                <Input
                  id="pay-card-name"
                  placeholder="John Doe"
                  {...register("cardholderName")}
                  className={errors.cardholderName ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                  disabled={isProcessingPay}
                  required
                />
                {errors.cardholderName && (
                  <p className="text-xs text-destructive">{errors.cardholderName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pay-card-number">Card Number</Label>
                <Input
                  id="pay-card-number"
                  placeholder="4111222233334444"
                  maxLength={16}
                  {...register("cardNumber")}
                  className={errors.cardNumber ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                  disabled={isProcessingPay}
                  required
                />
                {errors.cardNumber && (
                  <p className="text-xs text-destructive">{errors.cardNumber.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pay-card-expiry">Expiry Date</Label>
                  <Input
                    id="pay-card-expiry"
                    placeholder="MM/YY"
                    maxLength={5}
                    {...register("expiryDate")}
                    className={errors.expiryDate ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                    disabled={isProcessingPay}
                    required
                  />
                  {errors.expiryDate && (
                    <p className="text-xs text-destructive">{errors.expiryDate.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pay-card-cvv">CVV</Label>
                  <Input
                    id="pay-card-cvv"
                    placeholder="123"
                    maxLength={3}
                    {...register("cvv")}
                    className={errors.cvv ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                    disabled={isProcessingPay}
                    required
                  />
                  {errors.cvv && (
                    <p className="text-xs text-destructive">{errors.cvv.message}</p>
                  )}
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClosePay}
                  disabled={isProcessingPay}
                  className="rounded-lg text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isProcessingPay}
                  className="rounded-lg text-xs font-semibold px-4 flex items-center gap-1.5"
                >
                  {isProcessingPay && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Authorize Payment
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
