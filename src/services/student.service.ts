import { api } from "@/lib/api";

export interface Room {
  _id?: string;
  id?: string;
  number: string;
  capacity: number;
  occupied: number;
  available: boolean;
}

export interface Complaint {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  status: "Pending" | "Solved";
  studentId: string;
  createdAt: string;
}

export interface Notice {
  _id?: string;
  id?: string;
  title: string;
  content: string;
  createdAt: string;
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
  getMyRoom: async () => {
    const response = await api.get("/api/student/my-room");
    return response.data;
  },

  bookRoom: async (roomId: string) => {
    const response = await api.post(`/api/student/book-room/${roomId}`);
    return response.data;
  },

  cancelSeat: async () => {
    const response = await api.post("/api/student/cancel-seat");
    return response.data;
  },

  getComplaints: async () => {
    const response = await api.get("/api/student/complaints");
    return response.data;
  },

  createComplaint: async (data: { title: string; description: string }) => {
    const response = await api.post("/api/student/complaints", data);
    return response.data;
  },

  getNotices: async () => {
    const response = await api.get("/api/student/notices");
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
};
