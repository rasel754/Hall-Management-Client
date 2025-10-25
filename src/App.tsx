import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import NotFound from "./pages/NotFound";

// Student Pages
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />

          {/* Student Routes */}
          <Route
            path="/student/my-room"
            element={
              <DashboardLayout requiredRole="student">
                <MyRoom />
              </DashboardLayout>
            }
          />
          <Route
            path="/student/hall-booking"
            element={
              <DashboardLayout requiredRole="student">
                <HallBooking />
              </DashboardLayout>
            }
          />
          <Route
            path="/student/cancel-seat"
            element={
              <DashboardLayout requiredRole="student">
                <CancelSeat />
              </DashboardLayout>
            }
          />
          <Route
            path="/student/complaints"
            element={
              <DashboardLayout requiredRole="student">
                <Complaints />
              </DashboardLayout>
            }
          />
          <Route
            path="/student/notices"
            element={
              <DashboardLayout requiredRole="student">
                <Notices />
              </DashboardLayout>
            }
          />
          <Route
            path="/student/edit-profile"
            element={
              <DashboardLayout requiredRole="student">
                <EditProfile />
              </DashboardLayout>
            }
          />
          <Route
            path="/student/payment"
            element={
              <DashboardLayout requiredRole="student">
                <Payment />
              </DashboardLayout>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/overview"
            element={
              <DashboardLayout requiredRole="admin">
                <Overview />
              </DashboardLayout>
            }
          />
          <Route
            path="/admin/room-approvals"
            element={
              <DashboardLayout requiredRole="admin">
                <RoomApprovals />
              </DashboardLayout>
            }
          />
          <Route
            path="/admin/student-list"
            element={
              <DashboardLayout requiredRole="admin">
                <StudentList />
              </DashboardLayout>
            }
          />
          <Route
            path="/admin/make-notice"
            element={
              <DashboardLayout requiredRole="admin">
                <MakeNotice />
              </DashboardLayout>
            }
          />
          <Route
            path="/admin/block-user"
            element={
              <DashboardLayout requiredRole="admin">
                <BlockUser />
              </DashboardLayout>
            }
          />
          <Route
            path="/admin/solve-complaints"
            element={
              <DashboardLayout requiredRole="admin">
                <SolveComplaints />
              </DashboardLayout>
            }
          />
          <Route
            path="/admin/available-rooms"
            element={
              <DashboardLayout requiredRole="admin">
                <AvailableRooms />
              </DashboardLayout>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
