export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  description: string;
  category: "maintenance" | "facility" | "roommate" | "other";
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "resolved";
  createdAt: string;
  resolvedAt?: string;
}

export const mockComplaints: Complaint[] = [
  {
    id: "1",
    studentId: "1",
    studentName: "John Doe",
    title: "AC not working",
    description: "The air conditioning unit in room 101 has stopped working. It's getting very hot.",
    category: "maintenance",
    priority: "high",
    status: "in-progress",
    createdAt: "2024-10-20T10:30:00",
  },
  {
    id: "2",
    studentId: "2",
    studentName: "Jane Smith",
    title: "WiFi connection issues",
    description: "Frequent disconnections in the WiFi network on the first floor.",
    category: "facility",
    priority: "medium",
    status: "pending",
    createdAt: "2024-10-22T14:20:00",
  },
  {
    id: "3",
    studentId: "4",
    studentName: "Emily Davis",
    title: "Noisy roommate",
    description: "My roommate plays loud music late at night, disrupting my studies.",
    category: "roommate",
    priority: "medium",
    status: "pending",
    createdAt: "2024-10-23T09:15:00",
  },
  {
    id: "4",
    studentId: "1",
    studentName: "John Doe",
    title: "Broken study table",
    description: "The study table in my room is broken and needs repair.",
    category: "maintenance",
    priority: "low",
    status: "resolved",
    createdAt: "2024-10-15T11:00:00",
    resolvedAt: "2024-10-18T16:00:00",
  },
];
