export interface Room {
  id: string;
  roomNumber: string;
  building: string;
  floor: number;
  capacity: number;
  occupied: number;
  type: "single" | "double" | "triple" | "quad";
  amenities: string[];
  pricePerMonth: number;
  status: "available" | "full" | "maintenance";
}

export interface RoomBooking {
  id: string;
  studentId: string;
  studentName: string;
  roomId: string;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
  moveInDate: string;
}

export const mockRooms: Room[] = [
  {
    id: "101",
    roomNumber: "101",
    building: "A Block",
    floor: 1,
    capacity: 2,
    occupied: 1,
    type: "double",
    amenities: ["WiFi", "AC", "Attached Bathroom", "Study Desk"],
    pricePerMonth: 500,
    status: "available",
  },
  {
    id: "102",
    roomNumber: "102",
    building: "A Block",
    floor: 1,
    capacity: 2,
    occupied: 2,
    type: "double",
    amenities: ["WiFi", "AC", "Attached Bathroom"],
    pricePerMonth: 500,
    status: "full",
  },
  {
    id: "201",
    roomNumber: "201",
    building: "A Block",
    floor: 2,
    capacity: 1,
    occupied: 1,
    type: "single",
    amenities: ["WiFi", "AC", "Attached Bathroom", "Study Desk", "Balcony"],
    pricePerMonth: 750,
    status: "full",
  },
  {
    id: "202",
    roomNumber: "202",
    building: "A Block",
    floor: 2,
    capacity: 1,
    occupied: 0,
    type: "single",
    amenities: ["WiFi", "AC", "Attached Bathroom", "Study Desk"],
    pricePerMonth: 750,
    status: "available",
  },
  {
    id: "301",
    roomNumber: "301",
    building: "B Block",
    floor: 3,
    capacity: 3,
    occupied: 2,
    type: "triple",
    amenities: ["WiFi", "Fan", "Common Bathroom"],
    pricePerMonth: 350,
    status: "available",
  },
  {
    id: "302",
    roomNumber: "302",
    building: "B Block",
    floor: 3,
    capacity: 4,
    occupied: 0,
    type: "quad",
    amenities: ["WiFi", "Fan", "Common Bathroom", "Study Area"],
    pricePerMonth: 300,
    status: "maintenance",
  },
];

export const mockRoomBookings: RoomBooking[] = [
  {
    id: "1",
    studentId: "3",
    studentName: "Michael Johnson",
    roomId: "202",
    requestDate: "2024-10-20",
    status: "pending",
    moveInDate: "2024-11-01",
  },
  {
    id: "2",
    studentId: "6",
    studentName: "Sarah Brown",
    roomId: "301",
    requestDate: "2024-10-22",
    status: "pending",
    moveInDate: "2024-11-01",
  },
];
