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
} from "lucide-react";
import { useRoleStore } from "@/store/useRoleStore";
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
  { title: "My Room", url: "/student/my-room", icon: DoorOpen },
  { title: "Hall Booking", url: "/student/hall-booking", icon: Calendar },
  { title: "Cancel Seat", url: "/student/cancel-seat", icon: XCircle },
  { title: "My Complaints", url: "/student/complaints", icon: MessageSquare },
  { title: "Check Notice", url: "/student/notices", icon: Bell },
  { title: "Edit Profile", url: "/student/edit-profile", icon: User },
  { title: "Payment", url: "/student/payment", icon: CreditCard },
];

const adminMenuItems = [
  { title: "Overview", url: "/admin/overview", icon: Home },
  { title: "Room Approvals", url: "/admin/room-approvals", icon: CheckSquare },
  { title: "Student List", url: "/admin/student-list", icon: Users },
  { title: "Make Notice", url: "/admin/make-notice", icon: PlusCircle },
  { title: "Block User", url: "/admin/block-user", icon: UserX },
  { title: "Solve Complaints", url: "/admin/solve-complaints", icon: Wrench },
  { title: "Available Rooms", url: "/admin/available-rooms", icon: Building },
];

export function DashboardSidebar() {
  const { role } = useRoleStore();
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const menuItems = role === "student" ? studentMenuItems : adminMenuItems;
  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">

      <SidebarContent className="bg-sidebar">
        <div className={`p-4 border-b border-sidebar-border ${isCollapsed ? "text-center" : ""}`}>
          <h2 className={`font-bold text-sidebar-foreground ${isCollapsed ? "text-sm" : "text-xl"}`}>
            {isCollapsed ? "HM" : "Hall Manager"}
          </h2>
          {!isCollapsed && (
            <p className="text-xs text-sidebar-foreground/70 mt-1">
              {role === "student" ? "Student Portal" : "Admin Portal"}
            </p>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">
            {!isCollapsed && "Menu"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                        isActive(item.url)
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                      }`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/logout"
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span>Logout</span>}
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
