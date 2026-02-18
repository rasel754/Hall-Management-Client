import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { adminService, DashboardStats } from "@/services/admin.service";
import { Users, Building, MessageSquare, Bell, Loader2, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

// Define the initial state structure to match the expected DashboardStats interface
const initialStats: DashboardStats = {
  totalStudents: 0,
  activeStudents: 0,
  totalRooms: 0,
  availableRooms: 0,
  pendingComplaints: 0,
  activeNotices: 0,
};

const Overview = () => {
  const [data, setData] = useState<DashboardStats>(initialStats);
  const [loading, setLoading] = useState(true);

  // Fetch real data from the backend on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await adminService.getDashboard();

        // Assuming response.data matches the DashboardStats interface
        setData(response.data);
      } catch (error) {
        // Safe error handling using Axios pattern from previous fixes
        const errorMessage = (error as any).response?.data?.message || "Failed to load dashboard data.";
        toast.error(errorMessage);
        // Fallback to initial state on error
        setData(initialStats);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // Run once on mount

  // Calculate derived stats from the actual fetched data
  const { totalStudents, activeStudents, totalRooms, availableRooms, pendingComplaints, activeNotices } = data;

  const occupiedRooms = totalRooms - availableRooms;

  // Mock data for Recent Activities (Replace with real API calls if available)
  const recentActivities = [
    { id: 1, action: "New student registered", student: "Michael Johnson", time: "2 hours ago" },
    { id: 2, action: "Room booking approved", student: "Sarah Brown", time: "5 hours ago" },
    { id: 3, action: "Complaint resolved", student: "John Doe", time: "1 day ago" },
    { id: 4, action: "Notice published", student: "Admin Office", time: "2 days ago" },
  ];

  const statsArray = [
    {
      title: "Total Students",
      value: totalStudents,
      subtitle: `${activeStudents} active`,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Total Rooms",
      value: totalRooms,
      subtitle: `${availableRooms} available`,
      icon: Building,
      color: "text-green-600",
    },
    {
      title: "Pending Complaints",
      value: pendingComplaints,
      subtitle: "Need attention",
      icon: MessageSquare,
      color: "text-orange-600",
    },
    {
      title: "Active Notices",
      value: activeNotices,
      subtitle: "Published",
      icon: Bell,
      color: "text-purple-600",
    },
  ];

  // Render Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading dashboard data...</p>
      </div>
    );
  }

  // Calculate Occupancy Percentage safely
  const occupancyPercentage = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;


  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsArray.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest actions in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.student}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Occupancy Rate</CardTitle>
            <CardDescription>Room utilization statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Total Capacity</span>
                  <span className="text-sm font-bold">
                    {occupiedRooms}/{totalRooms}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{
                      width: `${occupancyPercentage}%`,
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <TrendingUp className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <div className="text-2xl font-bold">{availableRooms}</div>
                  <div className="text-xs text-muted-foreground">Available</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Building className="h-5 w-5 mx-auto mb-1 text-primary" />
                  <div className="text-2xl font-bold">{occupiedRooms}</div>
                  <div className="text-xs text-muted-foreground">Occupied</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default Overview;