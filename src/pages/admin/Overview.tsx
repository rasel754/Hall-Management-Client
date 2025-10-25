import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockStudents } from "@/data/students";
import { mockRooms } from "@/data/rooms";
import { mockComplaints } from "@/data/complaints";
import { mockNotices } from "@/data/notices";
import { Users, Building, MessageSquare, Bell, TrendingUp } from "lucide-react";

const Overview = () => {
  const totalStudents = mockStudents.length;
  const activeStudents = mockStudents.filter((s) => s.status === "active").length;
  const totalRooms = mockRooms.length;
  const availableRooms = mockRooms.filter((r) => r.status === "available").length;
  const pendingComplaints = mockComplaints.filter((c) => c.status === "pending").length;
  const activeNotices = mockNotices.length;

  const stats = [
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

  const recentActivities = [
    { id: 1, action: "New student registered", student: "Michael Johnson", time: "2 hours ago" },
    { id: 2, action: "Room booking approved", student: "Sarah Brown", time: "5 hours ago" },
    { id: 3, action: "Complaint resolved", student: "John Doe", time: "1 day ago" },
    { id: 4, action: "Notice published", student: "Admin Office", time: "2 days ago" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
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
                    {mockRooms.reduce((sum, r) => sum + r.occupied, 0)}/
                    {mockRooms.reduce((sum, r) => sum + r.capacity, 0)}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{
                      width: `${(mockRooms.reduce((sum, r) => sum + r.occupied, 0) / mockRooms.reduce((sum, r) => sum + r.capacity, 0)) * 100}%`,
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
                  <div className="text-2xl font-bold">{totalRooms - availableRooms}</div>
                  <div className="text-xs text-muted-foreground">Occupied</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
