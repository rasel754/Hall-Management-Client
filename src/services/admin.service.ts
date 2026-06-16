import { api } from "@/lib/api";

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalRooms: number;
  availableRooms: number;
  pendingComplaints: number;
  activeNotices: number;
}

export const adminService = {
  getDashboard: async (): Promise<{ data: DashboardStats }> => {
    try {
      const results = await Promise.allSettled([
        api.get("/api/users"),
        api.get("/api/rooms"),
        api.get("/api/notices"),
        api.get("/api/complaints")
      ]);

      const getPayload = (result: PromiseSettledResult<any>) => {
        if (result.status === 'fulfilled') {
          return result.value.data;
        }
        console.error("Dashboard API call failed:", result.reason);
        return null;
      };

      const usersPayload = getPayload(results[0]);
      const roomsPayload = getPayload(results[1]);
      const noticesPayload = getPayload(results[2]);
      const complaintsPayload = getPayload(results[3]);

      // Robust extraction helper
      const extractArray = (payload: any, key: string) => {
        if (!payload) return [];
        if (Array.isArray(payload)) return payload;
        if (payload.data && Array.isArray(payload.data)) return payload.data;
        if (payload[key] && Array.isArray(payload[key])) return payload[key];
        if (payload.data && payload.data[key] && Array.isArray(payload.data[key])) return payload.data[key];

        // Handle common variations
        if (payload.users && Array.isArray(payload.users)) return payload.users;
        if (payload.rooms && Array.isArray(payload.rooms)) return payload.rooms;
        if (payload.notices && Array.isArray(payload.notices)) return payload.notices;
        if (payload.complaints && Array.isArray(payload.complaints)) return payload.complaints;

        return [];
      };

      const users = extractArray(usersPayload, 'users');
      const rooms = extractArray(roomsPayload, 'rooms');
      const notices = extractArray(noticesPayload, 'notices');
      const complaints = extractArray(complaintsPayload, 'complaints');



      // Calculate stats
      const students = users.filter((u: any) => u.role === 'student');
      const totalStudents = students.length;
      const activeStudents = students.filter((s: any) => !s.blocked).length;

      const totalRooms = rooms.length;
      // Rooms use 'status' field based on AvailableRooms.tsx
      const availableRooms = rooms.filter((r: any) => r.status === 'available').length;

      const activeNotices = notices.filter((n: any) => n.isActive !== false).length;
      const pendingComplaints = complaints.filter((c: any) => c.status === 'Pending' || c.status === 'pending').length;

      return {
        data: {
          totalStudents,
          activeStudents,
          totalRooms,
          availableRooms,
          pendingComplaints,
          activeNotices
        }
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      return {
        data: {
          totalStudents: 0,
          activeStudents: 0,
          totalRooms: 0,
          availableRooms: 0,
          pendingComplaints: 0,
          activeNotices: 0,
        }
      };
    }
  },


  getAllUsers: async () => {
    const response = await api.get("/api/users");
    return response.data;
  },

  getAllRooms: async () => {
    const response = await api.get("/api/rooms");
    return response.data;
  },

  createRoom: async (data: any) => {
    const response = await api.post("/api/rooms", data);
    return response.data;
  },

  updateRoom: async (id: string, data: any) => {
    const response = await api.patch(`/api/rooms/${id}`, data);
    return response.data;
  },

  deleteRoom: async (id: string) => {
    const response = await api.delete(`/api/rooms/${id}`);
    return response.data;
  },

  // Keeping this for backward compatibility if needed, but getAllRooms is preferred now
  getAvailableRooms: async () => {
    const response = await api.get("/api/admin/available-rooms");
    return response.data;
  },

  createNotice: async (data: any) => {
    const response = await api.post("/api/notices", data);
    return response.data;
  },

  blockUser: async (userId: string) => {
    const response = await api.patch(`/api/admin/block-user/${userId}`);
    return response.data;
  },

  activateUser: async (userId: string) => {
    const response = await api.patch(`/api/users/${userId}/activate`);
    return response.data;
  },

  deactivateUser: async (userId: string) => {
    const response = await api.patch(`/api/users/${userId}/deactivate`);
    return response.data;
  },

  getStudents: async () => {
    const response = await api.get("/api/users");
    // Filter for students if the API returns all users
    if (response.data && Array.isArray(response.data)) {
      // Assuming the API returns an array of users directly or nested in data property
      // This logic mimics getAllUsers but ensures we have a dedicated method as expected by the UI
      return { success: true, data: response.data.filter((u: any) => u.role === 'student') };
    }
    // Handle case where data might be nested differently based on other methods
    const users = response.data.data || response.data;
    if (Array.isArray(users)) {
      return { success: true, data: users.filter((u: any) => u.role === 'student') };
    }
    return response.data;
  },

  solveComplaint: async (complaintId: string) => {
    const response = await api.patch(`/api/admin/solve-complaint/${complaintId}`);
    return response.data;
  },

  // Helper to get complaints if needed elsewhere
  getAllComplaints: async () => {
    const response = await api.get("/api/complaints");
    return response.data;
  },

  updateComplaintStatus: async (id: string, data: { status: string; resolution?: string }) => {
    const response = await api.patch(`/api/complaints/${id}`, data);
    return response.data;
  },

  createHall: async (data: {
    name: string;
    address: string;
    description?: string;
    totalRooms: number;
    availableRooms: number;
    amenities: string[];
    isActive: boolean;
  }) => {
    const response = await api.post("/api/halls", data);
    return response.data;
  },

  getAllHalls: async () => {
    const response = await api.get("/api/halls");
    return response.data;
  },

  updateHall: async (id: string, data: any) => {
    const response = await api.patch(`/api/halls/${id}`, data);
    return response.data;
  },

  deleteHall: async (id: string) => {
    const response = await api.delete(`/api/halls/${id}`);
    return response.data;
  },

  getRoomBookings: async () => {
    const response = await api.get("/api/bookings");
    return response.data;
  },

  approveRoomBooking: async (id: string) => {
    const response = await api.patch(`/api/bookings/${id}/approve`, { status: "approved" });
    return response.data;
  },

  rejectRoomBooking: async (id: string) => {
    const response = await api.patch(`/api/bookings/${id}/approve`, { status: "rejected" });
    return response.data;
  },

  getAllNotices: async () => {
    const response = await api.get("/api/notices");
    return response.data;
  },

  updateNotice: async (id: string, data: any) => {
    const response = await api.patch(`/api/notices/${id}`, data);
    return response.data;
  },

  deleteNotice: async (id: string) => {
    const response = await api.delete(`/api/notices/${id}`);
    return response.data;
  }
};
