import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStudentProfile } from "@/hooks/useStudentProfile";
import { useRoomBooking } from "@/hooks/useRoomBooking";
import { studentService } from "@/services/student.service";
import { useAuthStore } from "@/store/authStore";
import { DoorOpen, Bell, CreditCard, MessageSquare, ArrowRight, BookOpen, AlertCircle, FileText } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import { SkeletonCard } from "@/components/ui/skeleton-custom";
import { formatDistanceToNow } from "date-fns";

export default function StudentOverview() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { myRoom, isLoadingRoom } = useStudentProfile();
  const { bookings, isLoadingBookings } = useRoomBooking();

  const [notices, setNotices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loadingExtra, setLoadingExtra] = useState(true);

  useEffect(() => {
    const fetchExtraData = async () => {
      try {
        const [noticesRes, paymentsRes] = await Promise.allSettled([
          studentService.getNotices(),
          studentService.getPayments(),
        ]);

        if (noticesRes.status === "fulfilled") {
          setNotices(noticesRes.value.data || noticesRes.value || []);
        }
        if (paymentsRes.status === "fulfilled") {
          setPayments(paymentsRes.value.data || paymentsRes.value || []);
        }
      } catch (err) {
        console.error("Error fetching extra overview data:", err);
      } finally {
        setLoadingExtra(false);
      }
    };
    fetchExtraData();
  }, []);

  const isLoading = isLoadingRoom || isLoadingBookings || loadingExtra;

  // Derive Statistics
  const roomStatus = myRoom
    ? `Room ${myRoom.roomNumber || myRoom.number || "Assigned"}`
    : "No Room Allocated";

  const pendingRequestsCount = bookings.filter((b: any) => b.status === "pending").length;

  const unreadNoticesCount = notices.filter((n: any) => n.isActive !== false).length;

  const unpaidRents = payments.filter((p: any) => p.status === "Pending");
  const paymentStatusText = unpaidRents.length > 0 ? `${unpaidRents.length} Pending` : "Fully Paid";

  // Recharts Chart Data
  const chartData = payments.length > 0
    ? payments.map((p) => ({
        name: p.month,
        Amount: p.amount,
      })).reverse()
    : [
        { name: "Jan", Amount: 2000 },
        { name: "Feb", Amount: 2000 },
        { name: "Mar", Amount: 2000 },
        { name: "Apr", Amount: 2000 },
        { name: "May", Amount: 2000 },
        { name: "Jun", Amount: 2000 },
      ];

  const recentActivity = [
    ...(myRoom ? [{ id: "act1", action: "Allocated to room " + (myRoom.roomNumber || myRoom.number), date: new Date() }] : []),
    ...bookings.map((b) => ({
      id: b._id || b.id,
      action: `Room booking request status: ${b.status}`,
      date: new Date(b.createdAt || Date.now()),
    })),
    ...payments.slice(0, 2).map((p) => ({
      id: p._id || p.id,
      action: `Rent invoice for ${p.month}: ${p.status}`,
      date: new Date(p.createdAt || Date.now()),
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 4);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Overview" subtitle="Loading dashboard summary..." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Overview"
        subtitle={`Welcome back, ${user?.name || "Student"}!`}
        action={
          <Button onClick={() => navigate("/dashboard/student/profile")} variant="outline" className="rounded-lg h-9 text-xs">
            Edit Profile
          </Button>
        }
      />

      {/* 4 Stat Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={DoorOpen}
          title="Room Status"
          value={roomStatus}
          trend={myRoom ? { value: "Active", label: "Occupancy approved", isPositive: true } : { value: "Vacant", label: "Apply for seat", isPositive: false }}
        />
        <StatCard
          icon={BookOpen}
          title="Pending Requests"
          value={pendingRequestsCount}
          trend={{ value: pendingRequestsCount, label: "Booking petitions", isPositive: pendingRequestsCount === 0 }}
        />
        <StatCard
          icon={Bell}
          title="Unread Notices"
          value={unreadNoticesCount}
          trend={{ value: unreadNoticesCount, label: "Campus advisories", isPositive: true }}
        />
        <StatCard
          icon={CreditCard}
          title="Payment Status"
          value={paymentStatusText}
          trend={unpaidRents.length > 0 ? { value: "Due", label: "Pay outstanding bills", isPositive: false } : { value: "Paid", label: "No debts found", isPositive: true }}
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Payment Chart */}
        <Card className="lg:col-span-8 border-border bg-card shadow-md rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Rent History</CardTitle>
            <CardDescription>Rent transactions by billing cycles</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E2E8F0" }} />
                <Legend iconType="circle" />
                <Line
                  type="monotone"
                  dataKey="Amount"
                  stroke="#3730A3"
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                  dot={{ r: 4, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions Panel */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border bg-card shadow-md rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => navigate("/dashboard/student/my-room")}
                variant="outline"
                className="flex flex-col items-center justify-center p-6 h-auto gap-2 rounded-xl text-center text-xs hover:bg-primary/5 hover:text-primary transition-colors border-border bg-card"
              >
                <DoorOpen className="h-5 w-5" />
                My Room
              </Button>
              <Button
                onClick={() => navigate("/dashboard/student/hall-booking")}
                variant="outline"
                className="flex flex-col items-center justify-center p-6 h-auto gap-2 rounded-xl text-center text-xs hover:bg-primary/5 hover:text-primary transition-colors border-border bg-card"
              >
                <BookOpen className="h-5 w-5" />
                Book Seat
              </Button>
              <Button
                onClick={() => navigate("/dashboard/student/payment")}
                variant="outline"
                className="flex flex-col items-center justify-center p-6 h-auto gap-2 rounded-xl text-center text-xs hover:bg-primary/5 hover:text-primary transition-colors border-border bg-card"
              >
                <CreditCard className="h-5 w-5" />
                Pay Rent
              </Button>
              <Button
                onClick={() => navigate("/dashboard/student/complaints")}
                variant="outline"
                className="flex flex-col items-center justify-center p-6 h-auto gap-2 rounded-xl text-center text-xs hover:bg-primary/5 hover:text-primary transition-colors border-border bg-card"
              >
                <MessageSquare className="h-5 w-5" />
                Complaints
              </Button>
            </CardContent>
          </Card>

          {/* Recent Feed */}
          <Card className="border-border bg-card shadow-md rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((act) => (
                    <div key={act.id} className="flex gap-3 items-start">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div className="flex-1 space-y-0.5">
                        <p className="text-xs font-semibold text-foreground leading-normal">{act.action}</p>
                        <span className="text-[10px] text-muted-foreground/80">
                          {formatDistanceToNow(act.date, { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-muted-foreground">
                    No recent activities logged.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
