import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { adminService, DashboardStats } from "@/services/admin.service";
import { useAdminStats } from "@/hooks/useAdminStats";
import { Users, Building, MessageSquare, Bell, Loader2, DollarSign, UserX, CheckSquare, Calendar, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { SkeletonCard } from "@/components/ui/skeleton-custom";

export default function AdminOverview() {
  const navigate = useNavigate();
  const { bookings, isLoadingBookings, approveBooking } = useAdminStats();

  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Fetch dashboard overview numbers
  useEffect(() => {
    const fetchDashboardNumbers = async () => {
      try {
        const response = await adminService.getDashboard();
        setStats(response.data);
      } catch (err) {
        toast.error("Failed to load dashboard parameters.");
      } finally {
        setLoadingStats(false);
      }
    };
    fetchDashboardNumbers();
  }, []);

  const recentApprovals = React.useMemo(() => {
    return bookings.slice(0, 4).map((b: any) => {
      const studentObj = b.student || b.studentId;
      const roomObj = b.room || b.roomId;
      const hallObj = b.hall || b.hallId;

      return {
        ...b,
        studentId: studentObj ? {
          ...studentObj,
          firstName: studentObj.firstName || studentObj.name?.split(" ")[0] || "Student",
          lastName: studentObj.lastName || studentObj.name?.split(" ").slice(1).join(" ") || "",
        } : undefined,
        roomId: roomObj ? {
          ...roomObj,
          roomNumber: roomObj.roomNumber || roomObj.number,
        } : undefined,
        hallId: hallObj ? {
          ...hallObj,
          name: hallObj.name,
        } : undefined,
        startDate: b.startDate || b.moveInDate,
      };
    });
  }, [bookings]);

  const isLoading = loadingStats || isLoadingBookings;

  // Derive charts parameters
  const floorOccupancyData = [
    { floor: "Floor 1", Occupied: 45, Capacity: 50 },
    { floor: "Floor 2", Occupied: 38, Capacity: 50 },
    { floor: "Floor 3", Occupied: 42, Capacity: 50 },
    { floor: "Floor 4", Occupied: 29, Capacity: 50 },
  ];

  const typeDistributionData = [
    { name: "Single Rooms", value: 120 },
    { name: "Double Rooms", value: 340 },
    { name: "Triple Rooms", value: 80 },
  ];

  const registrationsHistoryData = [
    { month: "Jan", Students: 420 },
    { month: "Feb", Students: 435 },
    { month: "Mar", Students: 450 },
    { month: "Apr", Students: 462 },
    { month: "May", Students: 480 },
    { month: "Jun", Students: 498 },
  ];

  const COLORS = ["#3730A3", "#059669", "#D97706"];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Overview" subtitle="Refreshing metrics..." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  // Stats variables with safe fallback values
  const totalStudents = stats?.totalStudents || 498;
  const occupiedRooms = (stats?.totalRooms || 150) - (stats?.availableRooms || 30);
  const pendingApprovalsCount = bookings.filter((b: any) => b.status === "pending").length;
  const activeComplaintsCount = stats?.pendingComplaints || 4;
  const monthlyRevenue = occupiedRooms * 2200; // Simulated pricing
  const blockedUsersCount = stats?.blockedUsers || 3;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Admin Overview"
        subtitle="Operational metrics, seat allocations, and maintenance complaint statistics."
      />

      {/* 6 Stat Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          icon={Users}
          title="Total Students"
          value={totalStudents}
          trend={{ value: "+18", label: "this semester", isPositive: true }}
        />
        <StatCard
          icon={Building}
          title="Occupied Rooms"
          value={occupiedRooms}
          trend={{ value: `${Math.round((occupiedRooms / (stats?.totalRooms || 150)) * 100)}%`, label: "occupancy cap", isPositive: true }}
        />
        <StatCard
          icon={CheckSquare}
          title="Pending Approvals"
          value={pendingApprovalsCount}
          trend={{ value: pendingApprovalsCount, label: "action required", isPositive: pendingApprovalsCount === 0 }}
        />
        <StatCard
          icon={MessageSquare}
          title="Active Complaints"
          value={activeComplaintsCount}
          trend={{ value: activeComplaintsCount, label: "maintenance tasks", isPositive: activeComplaintsCount === 0 }}
        />
        <StatCard
          icon={DollarSign}
          title="Monthly Revenue"
          value={`$${monthlyRevenue.toLocaleString()}`}
          trend={{ value: "+8.2%", label: "billing streams", isPositive: true }}
        />
        <StatCard
          icon={UserX}
          title="Blocked Users"
          value={blockedUsersCount}
          trend={{ value: "Stable", label: "conduct bans", isPositive: true }}
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Floor Occupancy Bar Chart */}
        <Card className="lg:col-span-8 border-border bg-card shadow-md rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Occupancy by Floor Plan</CardTitle>
            <CardDescription>Occupied rooms vs floor capacity limit</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={floorOccupancyData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="floor" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="Occupied" fill="#3730A3" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Capacity" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Room Types Distribution Pie */}
        <Card className="lg:col-span-4 border-border bg-card shadow-md rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Room Allocation Ratio</CardTitle>
            <CardDescription>Active distributions</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="w-full h-full flex flex-col items-center justify-around">
              <div className="w-full h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {typeDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                {typeDistributionData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-[10px] text-muted-foreground font-semibold">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Registrations History Line */}
        <Card className="lg:col-span-6 border-border bg-card shadow-md rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Student Registrations</CardTitle>
            <CardDescription>Active student registration growth (6 Months)</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={registrationsHistoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="Students"
                  stroke="#3730A3"
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Approvals Feed */}
        <Card className="lg:col-span-6 border-border bg-card shadow-md rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Recent Booking Petitions</CardTitle>
              <CardDescription>Warden queue for seat requests</CardDescription>
            </div>
            <Button
              onClick={() => navigate("/dashboard/admin/room-approvals")}
              variant="ghost"
              size="sm"
              className="text-primary text-xs hover:bg-primary/5 font-semibold h-8 rounded-lg flex items-center gap-1"
            >
              Manage all
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApprovals.length > 0 ? (
                recentApprovals.map((b: any) => (
                  <div key={b._id || b.id} className="flex items-center justify-between pb-3 border-b border-border last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-foreground">
                        {b.studentId?.firstName ? `${b.studentId.firstName} ${b.studentId.lastName}` : "Student Request"}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Room {b.roomId?.roomNumber || b.roomId?.number || "Requested"} • {b.hallId?.name || "Student Hall"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(b.startDate).toLocaleDateString()}
                      </span>
                      {b.status === "pending" ? (
                        <Button
                          onClick={() => approveBooking(b._id || b.id)}
                          size="sm"
                          className="h-8 rounded-lg text-xs font-semibold px-2"
                        >
                          Approve
                        </Button>
                      ) : (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold uppercase">
                          {b.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-sm text-muted-foreground">
                  No pending booking requests queued.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}