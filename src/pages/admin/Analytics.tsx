import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, TrendingUp, DollarSign, HelpCircle, UserCheck } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { toast } from "sonner";

export default function AdminAnalytics() {
  const [dateRange, setDateRange] = useState("180");

  // Mock static data based on date range selection
  const revenueData = [
    { month: "Jan", Revenue: 45000 },
    { month: "Feb", Revenue: 49000 },
    { month: "Mar", Revenue: 52000 },
    { month: "Apr", Revenue: 48000 },
    { month: "May", Revenue: 58000 },
    { month: "Jun", Revenue: 62000 },
  ];

  const occupancyTrendData = [
    { month: "Jan", Rate: 78 },
    { month: "Feb", Rate: 80 },
    { month: "Mar", Rate: 84 },
    { month: "Apr", Rate: 83 },
    { month: "May", Rate: 89 },
    { month: "Jun", Rate: 94 },
  ];

  const complaintsResolutionData = [
    { name: "Resolved", value: 68 },
    { name: "In Progress", value: 20 },
    { name: "Unresolved", value: 12 },
  ];

  const intakeData = [
    { semester: "Fall 23", Intake: 180 },
    { semester: "Spring 24", Intake: 140 },
    { semester: "Fall 24", Intake: 210 },
    { semester: "Spring 25", Intake: 160 },
    { semester: "Fall 25", Intake: 240 },
    { semester: "Spring 26", Intake: 185 },
  ];

  const COLORS = ["#059669", "#D97706", "#EF4444"];

  const handleExportCSV = () => {
    try {
      const headers = ["Month/Term", "Metric Value", "Data Segment"];
      const rows = [
        ...revenueData.map((d) => [d.month, d.Revenue, "Monthly Revenue"]),
        ...occupancyTrendData.map((d) => [d.month, d.Rate + "%", "Occupancy Rate"]),
        ...complaintsResolutionData.map((d) => [d.name, d.value, "Complaints"]),
        ...intakeData.map((d) => [d.semester, d.Intake, "Student Intake"]),
      ];

      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `HallMS_Analytics_Report_${dateRange}_days.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV report exported successfully!");
    } catch (err) {
      toast.error("Failed to export report.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics & Reports"
        subtitle="Deep audit of hall bookings, financial revenue streams, and service resolution efficiency."
        action={
          <div className="flex items-center gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px] bg-card rounded-lg h-10 border-border">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
                <SelectItem value="180">Last 180 Days</SelectItem>
                <SelectItem value="365">Last 365 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExportCSV} className="rounded-lg h-10 px-4 font-semibold flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Monthly Revenue Bar */}
        <Card className="border-border bg-card shadow-md rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Monthly Revenue Stream</CardTitle>
              <CardDescription>Clearing invoice logs</CardDescription>
            </div>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip formatter={(value) => `$${value}`} />
                <Bar dataKey="Revenue" fill="#3730A3" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Occupancy Trend Line */}
        <Card className="border-border bg-card shadow-md rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Occupancy Trend Rate</CardTitle>
              <CardDescription>Capacity occupancy percentage</CardDescription>
            </div>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={occupancyTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} unit="%" />
                <Tooltip formatter={(value) => `${value}%`} />
                <Line
                  type="monotone"
                  dataKey="Rate"
                  stroke="#059669"
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Complaint Resolution Pie */}
        <Card className="border-border bg-card shadow-md rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Complaint Resolution Rate</CardTitle>
              <CardDescription>Warden ticket response allocation</CardDescription>
            </div>
            <HelpCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="w-full h-full flex flex-col sm:flex-row items-center justify-around">
              <div className="w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={complaintsResolutionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {complaintsResolutionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {complaintsResolutionData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-xs text-foreground font-semibold">
                      {d.name}: {d.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student Intake Area Chart */}
        <Card className="border-border bg-card shadow-md rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Student Intake Admissions</CardTitle>
              <CardDescription>Academic semester admission trends</CardDescription>
            </div>
            <UserCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={intakeData}>
                <defs>
                  <linearGradient id="colorIntake" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3730A3" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3730A3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="semester" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="Intake" stroke="#3730A3" strokeWidth={3} fillOpacity={1} fill="url(#colorIntake)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
