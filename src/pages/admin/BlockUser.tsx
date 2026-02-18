import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  firstName: string; // Changed from name to firstName
  lastName?: string; // Added optional lastName
  email: string;
  role: string; // Added role
  // blocked?: boolean; // Deprecated or removed in favor of isActive
  isActive?: boolean;
  roomId?: string;
}

const BlockUser = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    studentId: string | null;
    currentStatus: boolean; // true = active, false = inactive
    studentName: string;
  }>({
    open: false,
    studentId: null,
    currentStatus: false,
    studentName: "",
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      // Use getAllUsers which we know works in StudentList, or robustly handle getStudents
      const response = await adminService.getAllUsers();

      let usersData: any[] = [];

      // Handle various response structures (copied logic from StudentList)
      if (response.data && Array.isArray(response.data.users)) {
        usersData = response.data.users;
      } else if (response.data && Array.isArray(response.data)) {
        usersData = response.data;
      } else if (response.users && Array.isArray(response.users)) {
        usersData = response.users;
      } else if (Array.isArray(response)) {
        usersData = response;
      }

      // Filter only students
      const studentsOnly = usersData.filter((user: any) => user.role === 'student');
      setStudents(studentsOnly);

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load students");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = Array.isArray(students) ? students.filter(
    (student) =>
      student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const initiateToggle = (studentId: string, currentStatus: boolean, studentName: string) => {
    setConfirmDialog({
      open: true,
      studentId,
      currentStatus,
      studentName,
    });
  };

  const handleConfirmToggle = async () => {
    const { studentId, currentStatus, studentName } = confirmDialog;
    if (!studentId) return;

    setConfirmDialog((prev) => ({ ...prev, open: false }));
    setTogglingId(studentId);

    try {
      // If currently active, we want to deactivate. If currently inactive, we activate.
      const response = currentStatus
        ? await adminService.deactivateUser(studentId)
        : await adminService.activateUser(studentId);

      const action = currentStatus ? "deactivated" : "activated";
      toast.success(`${studentName} has been ${action}`, {
        description: `Student access has been ${action}.`,
      });
      loadStudents();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update user status");
    } finally {
      setTogglingId(null);
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
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
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
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => {
                const studentId = student._id || student.id || "";
                const isToggling = togglingId === studentId;
                const isActive = student.isActive !== false;
                const fullName = `${student.firstName} ${student.lastName || ''}`.trim();

                return (
                  <TableRow key={studentId}>
                    <TableCell className="font-medium">{fullName}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.roomId ? `Room ${student.roomId}` : "Not assigned"}</TableCell>
                    <TableCell>
                      <Badge variant={isActive ? "outline" : "destructive"}>
                        {isActive ? "Active" : "Deactivated"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={isActive}
                          onCheckedChange={() => initiateToggle(studentId, isActive, fullName)}
                          disabled={isToggling}
                        />
                        <span className="text-sm text-muted-foreground">
                          {isToggling ? "Updating..." : isActive ? "Active" : "Deactivated"}
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

      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will {confirmDialog.currentStatus ? "deactivate" : "activate"} access for <strong>{confirmDialog.studentName}</strong>.
              {confirmDialog.currentStatus
                ? " They will no longer be able to log in."
                : " They will regain access to the portal."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmDialog(prev => ({ ...prev, open: false }))}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmToggle}
              className={confirmDialog.currentStatus ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
            >
              {confirmDialog.currentStatus ? "Deactivate" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BlockUser;
