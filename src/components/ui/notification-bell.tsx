import React from "react";
import { Bell, Check, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUIStore, SystemNotification } from "@/store/uiStore";
import { formatDistanceToNow } from "date-fns";

export function NotificationBell() {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  } = useUIStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  const getIconColorClass = (type: SystemNotification["type"]) => {
    switch (type) {
      case "payment":
        return "text-emerald-500 bg-emerald-500/10";
      case "booking":
        return "text-primary bg-primary/10";
      case "complaint":
        return "text-destructive bg-destructive/10";
      case "notice":
      default:
        return "text-amber-500 bg-amber-500/10";
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full hover:bg-muted/50" aria-label="Open notifications">
          <Bell className="h-5 w-5 text-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-pulse">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-96 rounded-xl bg-card border-border shadow-lg p-0" align="end">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4 bg-muted/20">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm text-foreground">Notifications</h4>
            {unreadCount > 0 && (
              <span className="text-[10px] bg-primary/20 text-primary font-bold px-1.5 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-8 text-xs text-primary hover:bg-primary/5 font-semibold"
            >
              <Check className="mr-1 h-3.5 w-3.5" />
              Read all
            </Button>
          )}
        </div>

        {/* List */}
        <div className="max-h-[350px] overflow-y-auto divide-y divide-border">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n.id)}
                className={`p-4 flex gap-3 cursor-pointer transition-colors hover:bg-muted/20 ${
                  !n.read ? "bg-primary/5 hover:bg-primary/10" : ""
                }`}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${getIconColorClass(n.type)}`}>
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold text-foreground leading-none">{n.title}</p>
                  <p className="text-xs text-muted-foreground leading-normal mt-1">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-1.5 block">
                    {formatDistanceToNow(new Date(n.date), { addSuffix: true })}
                  </p>
                </div>
                {!n.read && (
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                )}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8">
              <p className="text-sm text-muted-foreground">No notifications yet.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-2 border-t border-border flex justify-center bg-muted/10">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearNotifications}
              className="text-xs text-destructive hover:bg-destructive/10 w-full font-medium"
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Clear all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
