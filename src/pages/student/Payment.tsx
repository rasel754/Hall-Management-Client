import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockPayments } from "@/data/payments";
import { toast } from "sonner";
import { DollarSign, CreditCard } from "lucide-react";

const Payment = () => {
  const pendingPayment = mockPayments.find((p) => p.status === "pending");
  const totalPaid = mockPayments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const handlePayNow = (paymentId: string, amount: number) => {
    toast.success(`Payment of $${amount} processed successfully!`, {
      description: "Your payment has been recorded. Thank you!",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "outline";
      case "pending":
        return "secondary";
      case "overdue":
        return "destructive";
      default:
        return "secondary";
    }
  };

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
              {pendingPayment ? `Due by ${new Date(pendingPayment.dueDate).toLocaleDateString()}` : "No pending payments"}
            </p>
          </CardContent>
        </Card>
      </div>

      {pendingPayment && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Pending Payment</CardTitle>
            <CardDescription>Complete your payment before the due date</CardDescription>
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
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="text-lg font-semibold">{new Date(pendingPayment.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
            <Button className="w-full" onClick={() => handlePayNow(pendingPayment.id, pendingPayment.amount)}>
              Pay Now
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
                <TableHead>Due Date</TableHead>
                <TableHead>Paid Date</TableHead>
                <TableHead>Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.month}</TableCell>
                  <TableCell>${payment.amount}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(payment.status) as any}>{payment.status}</Badge>
                  </TableCell>
                  <TableCell>{new Date(payment.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>{payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : "-"}</TableCell>
                  <TableCell className="capitalize">{payment.method || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payment;
