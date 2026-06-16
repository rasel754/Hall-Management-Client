import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  DoorOpen,
  Calendar,
  XCircle,
  MessageSquare,
  Bell,
  User,
  CreditCard,
  LogOut,
  Users,
  CheckSquare,
  UserX,
  Wrench,
  Building,
  PlusCircle,
  LayoutDashboard,
  Settings,
  BarChart3,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const studentMenuItems = [
  { title: "Overview", url: "/dashboard/student/overview", icon: LayoutDashboard },
  { title: "My Room", url: "/dashboard/student/my-room", icon: DoorOpen },
  { title: "Hall Booking", url: "/dashboard/student/hall-booking", icon: Calendar },
  { title: "Cancel Seat", url: "/dashboard/student/cancel-seat", icon: XCircle },
  { title: "My Complaints", url: "/dashboard/student/complaints", icon: MessageSquare },
  { title: "Notices", url: "/dashboard/student/notices", icon: Bell },
  { title: "Payment", url: "/dashboard/student/payment", icon: CreditCard },
  { title: "Profile Settings", url: "/dashboard/student/profile", icon: Settings },
];

const adminMenuItems = [
  { title: "Overview", url: "/dashboard/admin/overview", icon: Home },
  { title: "Room Approvals", url: "/dashboard/admin/room-approvals", icon: CheckSquare },
  { title: "Student Management", url: "/dashboard/admin/students", icon: Users },
  { title: "Hall Management", url: "/dashboard/admin/halls", icon: Building },
  { title: "Available Rooms", url: "/dashboard/admin/available-rooms", icon: DoorOpen },
  { title: "Notices", url: "/dashboard/admin/notices", icon: PlusCircle },
  { title: "Complaints", url: "/dashboard/admin/complaints", icon: Wrench },
  { title: "Block Users", url: "/dashboard/admin/block-users", icon: UserX },
  { title: "Analytics", url: "/dashboard/admin/analytics", icon: BarChart3 },
  { title: "Settings", url: "/dashboard/admin/settings", icon: Settings },
];

export function DashboardSidebar() {
  const { role } = useAuthStore();
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const menuItems = role === "student" ? studentMenuItems : adminMenuItems;

  // Exact matching or nested path active checker
  const isActive = (path: string) => {
    return location.pathname === path || (path !== "/" && location.pathname.startsWith(path));
  };

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-sidebar">
        <div className={`p-4 border-b border-sidebar-border ${isCollapsed ? "text-center" : ""}`}>
          <h2 className={`font-bold text-sidebar-foreground flex items-center justify-center gap-2 ${isCollapsed ? "text-sm" : "text-xl"}`}>
            <span>🏫</span>
            {!isCollapsed && "HallMS"}
          </h2>
          {!isCollapsed && (
            <p className="text-xs text-sidebar-foreground/70 mt-1 text-center font-medium">
              {role === "student" ? "Student Portal" : "Administrator Portal"}
            </p>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 text-[10px] uppercase font-bold tracking-wider">
            {!isCollapsed && "Menu Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive(item.url)
                          ? "bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/25"
                          : "text-sidebar-foreground/90 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                      }`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <div className="my-2 border-t border-sidebar-border/50" />

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/logout"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
