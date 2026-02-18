import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRoleStore } from "@/store/useRoleStore";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { studentService } from "@/services/student.service";

const EditProfile = () => {
  const { user, setAuth } = useRoleStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studentId: "",
    phoneNumber: "",
    address: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        studentId: user.studentId || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const updatedUser = await studentService.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
      });

      // Update local store with new data while preserving token and existing user data (like role)
      if (user) {
        setAuth(localStorage.getItem('token') || '', { ...user, ...updatedUser });
      }

      toast.success("Profile updated successfully", {
        description: "Your profile information has been saved.",
      });
    } catch (error: any) {
      toast.error("Failed to update profile", {
        description: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Edit Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your personal information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Update your avatar</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                  {formData.firstName?.[0]?.toUpperCase()}
                  {formData.lastName?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                className="absolute bottom-0 right-0 rounded-full h-10 w-10"
                variant="secondary"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" className="mt-4 w-full">
              Upload Photo
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  value={formData.studentId}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditProfile;
