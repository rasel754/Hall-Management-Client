import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminService } from "@/services/admin.service";
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Student {
  _id?: string;
  id?: string;
  firstName: string;
  email: string;
  role: string;
  blocked?: boolean;
  roomId?: string;
  createdAt?: string;
}

const StudentList = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const response = await adminService.getAllUsers();


      let usersData: Student[] = [];

      // Handle various response structures
      if (response.data && Array.isArray(response.data.users)) {
        // Structure: { data: { users: [...] } }
        usersData = response.data.users;
      } else if (response.data && Array.isArray(response.data)) {
        // Structure: { data: [...] }
        usersData = response.data;
      } else if (response.users && Array.isArray(response.users)) {
        // Structure: { users: [...] }
        usersData = response.users;
      } else if (Array.isArray(response)) {
        // Structure: [...]
        usersData = response;
      }

      // Filter only students
      const studentsOnly = usersData.filter((user: Student) => user.role === 'student');
      setStudents(studentsOnly);
    } catch (error: any) {
      console.error("Error fetching students:", error);
      toast.error(error.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (blocked?: boolean) => {
    return blocked ? "destructive" : "outline";
  };

  const getStatusText = (blocked?: boolean) => {
    return blocked ? "Blocked" : "Active";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Student List</h1>
        <p className="text-muted-foreground mt-2">Manage and view all registered students</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Students ({filteredStudents.length})</CardTitle>
              <CardDescription>Search and filter student records</CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student._id || student.id}>
                  <TableCell className="font-medium">{student.firstName}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.roomId ? `Room ${student.roomId}` : "Not assigned"}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(student.blocked) as any}>
                      {getStatusText(student.blocked)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentList;
