import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockStudents, Student } from "@/data/students";
import { toast } from "sonner";
import { Search } from "lucide-react";

const BlockUser = () => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleBlock = (studentId: string, currentStatus: Student["status"]) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, status: currentStatus === "blocked" ? "active" : "blocked" } : s
      )
    );

    const student = students.find((s) => s.id === studentId);
    const action = currentStatus === "blocked" ? "unblocked" : "blocked";

    toast.success(`${student?.name} has been ${action}`, {
      description: `Student access has been ${action}.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "outline";
      case "blocked":
        return "destructive";
      case "pending":
        return "secondary";
      default:
        return "secondary";
    }
  };

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
                <TableHead>Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Block/Unblock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.studentId}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.department}</TableCell>
                  <TableCell>{student.roomId ? `Room ${student.roomId}` : "Not assigned"}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(student.status) as any}>{student.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={student.status === "blocked"}
                        onCheckedChange={() => handleToggleBlock(student.id, student.status)}
                        disabled={student.status === "pending"}
                      />
                      <span className="text-sm text-muted-foreground">
                        {student.status === "blocked" ? "Blocked" : "Active"}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Important Notice</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Blocking a user will immediately revoke their access to the portal. They will not be able to log in or
            access any features until unblocked. Use this feature carefully and only when necessary.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockUser;
