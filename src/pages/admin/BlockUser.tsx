import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { Search, Loader2 } from "lucide-react";

interface Student {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  blocked?: boolean;
  roomId?: string;
}

const BlockUser = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [blockingId, setBlockingId] = useState<string | null>(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const response = await adminService.getStudents();
      if (response.success) {
        setStudents(response.data || []);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleBlock = async (studentId: string, currentBlocked: boolean, studentName: string) => {
    setBlockingId(studentId);
    try {
      const response = await adminService.blockUser(studentId);
      if (response.success) {
        const action = currentBlocked ? "unblocked" : "blocked";
        toast.success(`${studentName} has been ${action}`, {
          description: response.message || `Student access has been ${action}.`,
        });
        loadStudents();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update user status");
    } finally {
      setBlockingId(null);
    }
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
        <h1 className="text-3xl font-bold text-foreground">Block/Unblock Users</h1>
        <p className="text-muted-foreground mt-2">Manage student access to the system</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Student Access Management</CardTitle>
              <CardDescription>Control which students can access the portal</CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
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
                <TableHead>Block/Unblock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => {
                const studentId = student._id || student.id || "";
                const isBlocking = blockingId === studentId;
                
                return (
                  <TableRow key={studentId}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.roomId ? `Room ${student.roomId}` : "Not assigned"}</TableCell>
                    <TableCell>
                      <Badge variant={student.blocked ? "destructive" : "outline"}>
                        {student.blocked ? "Blocked" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={student.blocked || false}
                          onCheckedChange={() => handleToggleBlock(studentId, student.blocked || false, student.name)}
                          disabled={isBlocking}
                        />
                        <span className="text-sm text-muted-foreground">
                          {isBlocking ? "Updating..." : student.blocked ? "Blocked" : "Active"}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockUser;
