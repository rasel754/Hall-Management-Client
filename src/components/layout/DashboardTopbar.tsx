import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/ui/notification-bell";
import { Sun, Moon, LogOut, User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DashboardTopbar() {
  const { user, role, logout } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleProfileSettingsClick = () => {
    if (role === "student") {
      navigate("/dashboard/student/profile");
    } else {
      navigate("/dashboard/admin/settings");
    }
  };

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="h-10 w-10 text-foreground" />
        <h1 className="text-base md:text-lg font-bold text-foreground hidden sm:block">
          {role === "student" ? "Student Dashboard" : "Administration Dashboard"}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-10 w-10 rounded-full hover:bg-muted/50 text-foreground"
          aria-label="Toggle light and dark themes"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5 text-amber-400" />
          )}
        </Button>

        {/* Custom Notification Bell Popover */}
        <NotificationBell />

        {/* Profile Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-muted/50 p-0">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                  {user?.name ? getInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 rounded-xl bg-card border-border shadow-lg" align="end">
            <DropdownMenuLabel className="font-normal p-4">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-foreground leading-none">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground leading-none mt-1">
                  {user?.email || "user@university.edu"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleProfileSettingsClick}
              className="p-3 flex items-center gap-3 text-sm cursor-pointer hover:bg-muted/20"
            >
              {role === "student" ? (
                <>
                  <User className="h-4 w-4 text-muted-foreground" />
                  My Profile
                </>
              ) : (
                <>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  Settings
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="p-3 flex items-center gap-3 text-sm text-destructive cursor-pointer hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
