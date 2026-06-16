import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  date: string;
  type: "notice" | "booking" | "payment" | "complaint";
}

interface UIState {
  theme: "light" | "dark";
  sidebarOpen: boolean;
  notifications: SystemNotification[];
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setSidebar: (open: boolean) => void;
  addNotification: (notification: Omit<SystemNotification, "id" | "read" | "date">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

// Helper to check/apply theme class to html element
const applyThemeClass = (theme: "light" | "dark") => {
  if (typeof window !== "undefined") {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }
};

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: "light",
      sidebarOpen: true,
      notifications: [
        {
          id: "1",
          title: "New Notice Published",
          message: "The annual sports competition schedule is out. Check the notices section.",
          read: false,
          date: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          type: "notice"
        },
        {
          id: "2",
          title: "Payment Confirmation",
          message: "Your rent payment for June 2026 has been successfully processed.",
          read: true,
          date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          type: "payment"
        },
        {
          id: "3",
          title: "Booking Status Update",
          message: "Your booking request for Room 304 has been approved.",
          read: false,
          date: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
          type: "booking"
        }
      ],
      toggleTheme: () =>
        set((state) => {
          const nextTheme = state.theme === "light" ? "dark" : "light";
          applyThemeClass(nextTheme);
          return { theme: nextTheme };
        }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebar: (open) => set({ sidebarOpen: open }),
      addNotification: (noti) =>
        set((state) => ({
          notifications: [
            {
              ...noti,
              id: Math.random().toString(36).substr(2, 9),
              read: false,
              date: new Date().toISOString()
            },
            ...state.notifications
          ]
        })),
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          )
        })),
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true }))
        })),
      clearNotifications: () => set({ notifications: [] })
    }),
    {
      name: "hall-management-ui",
      onRehydrateStorage: () => (state) => {
        // Apply theme immediately on load/rehydration from localStorage
        if (state) {
          applyThemeClass(state.theme);
        }
      }
    }
  )
);
