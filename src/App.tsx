import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { Loader2 } from "lucide-react";

// Public Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import Help from "./pages/Help";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

// Student Pages
import StudentOverview from "./pages/student/Overview";
import MyRoom from "./pages/student/MyRoom";
import HallBooking from "./pages/student/HallBooking";
import CancelSeat from "./pages/student/CancelSeat";
import Complaints from "./pages/student/Complaints";
import Notices from "./pages/student/Notices";
import EditProfile from "./pages/student/EditProfile";
import Payment from "./pages/student/Payment";

// Admin Pages
import Overview from "./pages/admin/Overview";
import RoomApprovals from "./pages/admin/RoomApprovals";
import StudentList from "./pages/admin/StudentList";
import MakeNotice from "./pages/admin/MakeNotice";
import BlockUser from "./pages/admin/BlockUser";
import SolveComplaints from "./pages/admin/SolveComplaints";
import AvailableRooms from "./pages/admin/AvailableRooms";
import HallManagement from "./pages/admin/HallManagement";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/Settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            
            {/* Informational Routes */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/help" element={<Help />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            {/* Student Dashboard Routes */}
            <Route
              path="/dashboard/student/overview"
              element={
                <DashboardLayout requiredRole="student">
                  <StudentOverview />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/student/my-room"
              element={
                <DashboardLayout requiredRole="student">
                  <MyRoom />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/student/hall-booking"
              element={
                <DashboardLayout requiredRole="student">
                  <HallBooking />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/student/cancel-seat"
              element={
                <DashboardLayout requiredRole="student">
                  <CancelSeat />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/student/complaints"
              element={
                <DashboardLayout requiredRole="student">
                  <Complaints />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/student/notices"
              element={
                <DashboardLayout requiredRole="student">
                  <Notices />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/student/profile"
              element={
                <DashboardLayout requiredRole="student">
                  <EditProfile />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/student/payment"
              element={
                <DashboardLayout requiredRole="student">
                  <Payment />
                </DashboardLayout>
              }
            />

            {/* Admin Dashboard Routes */}
            <Route
              path="/dashboard/admin/overview"
              element={
                <DashboardLayout requiredRole="admin">
                  <Overview />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/admin/room-approvals"
              element={
                <DashboardLayout requiredRole="admin">
                  <RoomApprovals />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/admin/students"
              element={
                <DashboardLayout requiredRole="admin">
                  <StudentList />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/admin/notices"
              element={
                <DashboardLayout requiredRole="admin">
                  <MakeNotice />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/admin/block-users"
              element={
                <DashboardLayout requiredRole="admin">
                  <BlockUser />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/admin/complaints"
              element={
                <DashboardLayout requiredRole="admin">
                  <SolveComplaints />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/admin/halls"
              element={
                <DashboardLayout requiredRole="admin">
                  <HallManagement />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/admin/available-rooms"
              element={
                <DashboardLayout requiredRole="admin">
                  <AvailableRooms />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/admin/analytics"
              element={
                <DashboardLayout requiredRole="admin">
                  <AdminAnalytics />
                </DashboardLayout>
              }
            />
            <Route
              path="/dashboard/admin/settings"
              element={
                <DashboardLayout requiredRole="admin">
                  <AdminSettings />
                </DashboardLayout>
              }
            />

            {/* Redirect legacy links */}
            <Route path="/student/*" element={<Navigate to="/dashboard/student/overview" replace />} />
            <Route path="/admin/*" element={<Navigate to="/dashboard/admin/overview" replace />} />

            {/* Catch All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;