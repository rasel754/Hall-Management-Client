export interface Notice {
  id: string;
  title: string;
  content: string;
  category: "general" | "urgent" | "event" | "maintenance";
  createdAt: string;
  expiresAt?: string;
  author: string;
}

export const mockNotices: Notice[] = [
  {
    id: "1",
    title: "Semester Break Announcement",
    content: "The semester break will begin on December 20th and classes will resume on January 5th. All students must vacate their rooms by December 22nd.",
    category: "general",
    createdAt: "2024-10-15T09:00:00",
    expiresAt: "2024-12-20T00:00:00",
    author: "Admin Office",
  },
  {
    id: "2",
    title: "Water Supply Interruption",
    content: "Water supply will be interrupted on October 28th from 8 AM to 2 PM for maintenance work in B Block.",
    category: "urgent",
    createdAt: "2024-10-24T10:00:00",
    expiresAt: "2024-10-28T14:00:00",
    author: "Maintenance Department",
  },
  {
    id: "3",
    title: "Cultural Night - November 5th",
    content: "Join us for the annual Cultural Night on November 5th at 6 PM in the main auditorium. Students are encouraged to participate and showcase their talents.",
    category: "event",
    createdAt: "2024-10-20T12:00:00",
    expiresAt: "2024-11-05T18:00:00",
    author: "Student Council",
  },
  {
    id: "4",
    title: "Monthly Payment Reminder",
    content: "This is a reminder that monthly hall fees are due by the 5th of each month. Late payments will incur a penalty.",
    category: "general",
    createdAt: "2024-10-01T08:00:00",
    author: "Finance Office",
  },
  {
    id: "5",
    title: "Fire Safety Inspection",
    content: "A fire safety inspection will be conducted in all rooms on October 30th. Please ensure all electrical appliances are in working condition.",
    category: "maintenance",
    createdAt: "2024-10-23T11:00:00",
    expiresAt: "2024-10-30T17:00:00",
    author: "Safety Department",
  },
];
