export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  month: string;
  status: "paid" | "pending" | "overdue";
  paidDate?: string;
  dueDate: string;
  method?: "card" | "bank" | "cash";
}

export const mockPayments: Payment[] = [
  {
    id: "1",
    studentId: "1",
    amount: 500,
    month: "October 2024",
    status: "paid",
    paidDate: "2024-10-03",
    dueDate: "2024-10-05",
    method: "card",
  },
  {
    id: "2",
    studentId: "1",
    amount: 500,
    month: "November 2024",
    status: "pending",
    dueDate: "2024-11-05",
  },
  {
    id: "3",
    studentId: "1",
    amount: 500,
    month: "September 2024",
    status: "paid",
    paidDate: "2024-09-02",
    dueDate: "2024-09-05",
    method: "bank",
  },
  {
    id: "4",
    studentId: "1",
    amount: 500,
    month: "August 2024",
    status: "paid",
    paidDate: "2024-08-04",
    dueDate: "2024-08-05",
    method: "card",
  },
];
