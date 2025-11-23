import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { studentService, Payment } from "@/services/student.service";
import { toast } from "sonner";
import { DollarSign, CreditCard, Loader2 } from "lucide-react";

const PaymentPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const response = await studentService.getPayments();
      if (response.success) {
        setPayments(response.data || []);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  const pendingPayment = payments.find((p) => p.status === "Pending");
  const totalPaid = payments
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const handlePayNow = async (paymentId: string, amount: number) => {
    setPayingId(paymentId);
    try {
      const response = await studentService.payRent(paymentId);
      if (response.success) {
        toast.success(`Payment of $${amount} processed successfully!`, {
          description: response.message || "Your payment has been recorded. Thank you!",
        });
        loadPayments();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to process payment");
    } finally {
      setPayingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "outline";
      case "Pending":
        return "secondary";
      default:
        return "secondary";
    }
  };

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
        <h1 className="text-3xl font-bold text-foreground">Payment</h1>
        <p className="text-muted-foreground mt-2">Manage your hall fee payments</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPaid}</div>
            <p className="text-xs text-muted-foreground">All time payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingPayment?.amount || 0}</div>
            <p className="text-xs text-muted-foreground">
              {pendingPayment ? `Due payment` : "No pending payments"}
            </p>
          </CardContent>
        </Card>
      </div>

      {pendingPayment && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Pending Payment</CardTitle>
            <CardDescription>Complete your payment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-2xl font-bold">${pendingPayment.amount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Month</p>
                <p className="text-lg font-semibold">{pendingPayment.month}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-lg font-semibold">{pendingPayment.status}</p>
              </div>
            </div>
            <Button
              className="w-full"
              onClick={() => handlePayNow(pendingPayment._id || pendingPayment.id || "", pendingPayment.amount)}
              disabled={payingId === (pendingPayment._id || pendingPayment.id)}
            >
              {payingId === (pendingPayment._id || pendingPayment.id) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Pay Now"
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>View all your past transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment._id || payment.id}>
                  <TableCell className="font-medium">{payment.month}</TableCell>
                  <TableCell>${payment.amount}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(payment.status) as any}>{payment.status}</Badge>
                  </TableCell>
                  <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPage;
