export interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  department: string;
  year: number;
  phone: string;
  roomId?: string;
  status: "active" | "blocked" | "pending";
  joinedDate: string;
}

export const mockStudents: Student[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@university.edu",
    studentId: "STU001",
    department: "Computer Science",
    year: 3,
    phone: "+1 234 567 8901",
    roomId: "101",
    status: "active",
    joinedDate: "2023-09-01",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@university.edu",
    studentId: "STU002",
    department: "Electrical Engineering",
    year: 2,
    phone: "+1 234 567 8902",
    roomId: "102",
    status: "active",
    joinedDate: "2023-09-01",
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael.j@university.edu",
    studentId: "STU003",
    department: "Mechanical Engineering",
    year: 4,
    phone: "+1 234 567 8903",
    status: "pending",
    joinedDate: "2024-01-15",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.d@university.edu",
    studentId: "STU004",
    department: "Business Administration",
    year: 1,
    phone: "+1 234 567 8904",
    roomId: "201",
    status: "active",
    joinedDate: "2024-09-01",
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david.w@university.edu",
    studentId: "STU005",
    department: "Computer Science",
    year: 3,
    phone: "+1 234 567 8905",
    status: "blocked",
    joinedDate: "2023-09-01",
  },
];
