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
  getDashboard: async () => {
    const response = await api.get("/api/admin/dashboard");
    return response.data;
  },

  getRooms: async () => {
    const response = await api.get("/api/admin/rooms");
    return response.data;
  },

  getAvailableRooms: async () => {
    const response = await api.get("/api/admin/available-rooms");
    return response.data;
  },

  approveRoom: async (roomId: string) => {
    const response = await api.patch(`/api/admin/rooms/approve/${roomId}`);
    return response.data;
  },

  getStudents: async () => {
    const response = await api.get("/api/admin/students");
    return response.data;
  },

  createNotice: async (data: { title: string; content: string }) => {
    const response = await api.post("/api/admin/notices", data);
    return response.data;
  },

  blockUser: async (userId: string) => {
    const response = await api.patch(`/api/admin/block-user/${userId}`);
    return response.data;
  },

  solveComplaint: async (complaintId: string) => {
    const response = await api.patch(`/api/admin/solve-complaint/${complaintId}`);
    return response.data;
  },
};
