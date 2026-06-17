import { api } from "@/lib/api";

export interface Room {
  _id?: string;
  id?: string;
  roomNumber?: string;
  number?: string;
  capacity: number;
  occupied?: number;
  currentOccupancy?: number;
  available?: boolean;
  status?: string;
  hallId?: any;
  type?: string;
  price?: number;
  pricePerMonth?: number;
}

export interface Complaint {
  _id?: string;
  id?: string;
  studentId: string;
  title: string;
  description: string;
  category: string;
  status: "pending" | "resolved";
  priority: 'low' | 'medium' | 'high';
  resolution?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notice {
  _id?: string;
  id?: string;
  title: string;
  content: string;
  category: 'general' | 'urgent' | 'academic' | 'maintenance';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetAudience: ('admin' | 'student')[];
  isActive: boolean;
  createdBy?: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface Payment {
  _id?: string;
  id?: string;
  studentId: string;
  amount: number;
  month: string;
  status: "Pending" | "Paid";
  createdAt: string;
}

export const studentService = {
  getAllRooms: async () => {
    const response = await api.get("/api/rooms");
    return response.data;
  },

  getMyRoom: async () => {
    const response = await api.get("/api/student/my-room");
    return response.data;
  },

  getRoomById: async (id: string) => {
    const response = await api.get(`/api/rooms/${id}`);
    return response.data;
  },

  bookRoom: async (data: { roomId: string; hallId: string; startDate: string; remarks?: string }) => {
    const response = await api.post("/api/bookings", data);
    return response.data;
  },

  getBookings: async (params?: { status?: string; page?: number; limit?: number }) => {
    const response = await api.get("/api/bookings", { params });
    return response.data;
  },

  cancelBooking: async (bookingId: string) => {
    const response = await api.post(`/api/bookings/${bookingId}/cancel`);
    return response.data;
  },

  getComplaints: async () => {
    const response = await api.get("/api/complaints");
    return response.data;
  },

  createComplaint: async (data: Partial<Complaint>) => {
    const response = await api.post("/api/complaints", data);
    return response.data;
  },

  getNotices: async () => {
    const response = await api.get("/api/notices");
    return response.data;
  },

  getPayments: async () => {
    const response = await api.get("/api/student/payments");
    return response.data;
  },

  payRent: async (paymentId: string) => {
    const response = await api.post(`/api/student/payments/pay/${paymentId}`);
    return response.data;
  },

  deleteComplaint: async (id: string) => {
    const response = await api.delete(`/api/complaints/${id}`);
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await api.patch("/api/users/profile", data);
    return response.data;
  },
};
