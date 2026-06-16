import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { studentService } from "@/services/student.service";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/api";
import { Camera, Loader2, Save, KeyRound } from "lucide-react";

const profileSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  phoneNumber: z.string().min(6, "Please enter a valid phone number"),
  department: z.string().min(2, "Department must be at least 2 characters"),
  year: z.string().min(1, "Select study year"),
  emergencyContact: z.string().min(6, "Please provide an emergency contact phone number"),
  avatarUrl: z.string().url("Please enter a valid image URL").optional().or(z.literal("")),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Current password must be at least 6 characters"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must match"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords do not match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function EditProfile() {
  const { user, token, setAuth } = useAuth();
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    setValue: setProfileValue,
    watch: watchProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  // Password Form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  // Watch avatar URL to show instant preview
  const watchedAvatar = watchProfile("avatarUrl") || user?.avatar || "";

  useEffect(() => {
    if (user) {
      // Split address/string to parse dept and year if needed, or fill fields
      const deptPart = user.address?.split(", Year ")[0] || user.department || "Computer Science";
      const yearPart = user.address?.split(", Year ")[1] || "3";

      setProfileValue("fullName", user.name || "");
      setProfileValue("phoneNumber", user.phoneNumber || "1234567890");
      setProfileValue("department", deptPart);
      setProfileValue("year", yearPart);
      setProfileValue("emergencyContact", user.address?.split("Emergency: ")[1] || "9876543210");
      setProfileValue("avatarUrl", user.avatar || "");
    }
  }, [user, setProfileValue]);

  const onProfileSave = async (data: ProfileFormValues) => {
    setLoadingProfile(true);
    try {
      const nameParts = data.fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Format custom address mapping to include emergency and year details
      const addressString = `${data.department}, Year ${data.year}. Emergency: ${data.emergencyContact}`;

      const res = await studentService.updateProfile({
        firstName,
        lastName,
        phoneNumber: data.phoneNumber,
        address: addressString,
        avatar: data.avatarUrl || undefined,
      });

      // Sync local authStore session with response details
      const updatedUser = {
        ...user,
        name: data.fullName,
        firstName,
        lastName,
        phoneNumber: data.phoneNumber,
        address: addressString,
        avatar: data.avatarUrl || undefined,
        department: data.department,
      };

      if (token) {
        // useAuthStore/setAuth is re-exported via useRoleStore as setAuth/setRole
        const authStore = (await import("@/store/authStore")).useAuthStore.getState();
        authStore.setAuth(token, updatedUser as any);
      }

      toast.success("Profile details updated successfully!");
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoadingProfile(false);
    }
  };

  const onPasswordSave = async (data: PasswordFormValues) => {
    setLoadingPassword(true);
    try {
      // Mock password change API submission
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Password updated successfully!");
      resetPassword();
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setLoadingPassword(false);
    }
  };

  const getInitials = (n: string) => n.split(" ").map((x) => x[0]).join("").toUpperCase();

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Profile Settings"
        subtitle="Manage your personal credentials, contact numbers, and security keys."
      />

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
        {/* Avatar Upload Preview Column */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border bg-card shadow-md rounded-xl text-center">
            <CardHeader>
              <CardTitle className="text-base font-bold">Avatar Preview</CardTitle>
              <CardDescription>Visual photo preview before saving changes</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center p-6 pt-0">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-muted shadow-md">
                  <AvatarImage src={watchedAvatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                    {user?.name ? getInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-primary-foreground shadow-md">
                  <Camera className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-6 w-full space-y-2 text-left">
                <Label htmlFor="profile-avatar-url">Avatar Photo URL</Label>
                <Input
                  id="profile-avatar-url"
                  placeholder="https://image-url.com/avatar.jpg"
                  {...registerProfile("avatarUrl")}
                  className={profileErrors.avatarUrl ? "border-destructive focus-visible:ring-destructive rounded-lg h-9 text-xs" : "rounded-lg h-9 text-xs"}
                  aria-label="Paste avatar photo link URL here"
                />
                {profileErrors.avatarUrl && (
                  <p className="text-[10px] text-destructive">{profileErrors.avatarUrl.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form Details Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Personal Information */}
          <Card className="border-border bg-card shadow-md rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Personal Information</CardTitle>
              <CardDescription>Update your general university records</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit(onProfileSave)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile-fullname">Full Name</Label>
                    <Input
                      id="profile-fullname"
                      {...registerProfile("fullName")}
                      className={profileErrors.fullName ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                      disabled={loadingProfile}
                      aria-label="Edit your full name"
                    />
                    {profileErrors.fullName && (
                      <p className="text-xs text-destructive">{profileErrors.fullName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-phone">Phone Number</Label>
                    <Input
                      id="profile-phone"
                      type="tel"
                      {...registerProfile("phoneNumber")}
                      className={profileErrors.phoneNumber ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                      disabled={loadingProfile}
                      aria-label="Edit phone number"
                    />
                    {profileErrors.phoneNumber && (
                      <p className="text-xs text-destructive">{profileErrors.phoneNumber.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-dept">Department</Label>
                    <Input
                      id="profile-dept"
                      {...registerProfile("department")}
                      className={profileErrors.department ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                      disabled={loadingProfile}
                      aria-label="Edit department"
                    />
                    {profileErrors.department && (
                      <p className="text-xs text-destructive">{profileErrors.department.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-year">Study Year</Label>
                    <Input
                      id="profile-year"
                      {...registerProfile("year")}
                      className={profileErrors.year ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                      disabled={loadingProfile}
                      aria-label="Edit study year"
                    />
                    {profileErrors.year && (
                      <p className="text-xs text-destructive">{profileErrors.year.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-emergency">Emergency Contact (Phone)</Label>
                  <Input
                    id="profile-emergency"
                    type="tel"
                    {...registerProfile("emergencyContact")}
                    className={profileErrors.emergencyContact ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                    disabled={loadingProfile}
                    aria-label="Edit emergency contact phone number"
                  />
                  {profileErrors.emergencyContact && (
                    <p className="text-xs text-destructive">{profileErrors.emergencyContact.message}</p>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={loadingProfile} className="rounded-lg h-10 px-5 font-semibold flex items-center gap-1.5">
                    {loadingProfile ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Details
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card className="border-border bg-card shadow-md rounded-xl">
            <CardHeader className="flex flex-row items-center gap-3 bg-muted/10 pb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">Security & Password Keys</CardTitle>
                <CardDescription>Modify your account access credentials</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handlePasswordSubmit(onPasswordSave)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pass-current">Current Password</Label>
                  <Input
                    id="pass-current"
                    type="password"
                    placeholder="••••••••"
                    {...registerPassword("currentPassword")}
                    className={passwordErrors.currentPassword ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                    disabled={loadingPassword}
                    aria-label="Current security password"
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-xs text-destructive">{passwordErrors.currentPassword.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pass-new">New Password</Label>
                    <Input
                      id="pass-new"
                      type="password"
                      placeholder="••••••••"
                      {...registerPassword("newPassword")}
                      className={passwordErrors.newPassword ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                      disabled={loadingPassword}
                      aria-label="New account password"
                    />
                    {passwordErrors.newPassword && (
                      <p className="text-xs text-destructive">{passwordErrors.newPassword.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pass-confirm">Confirm New Password</Label>
                    <Input
                      id="pass-confirm"
                      type="password"
                      placeholder="••••••••"
                      {...registerPassword("confirmPassword")}
                      className={passwordErrors.confirmPassword ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                      disabled={loadingPassword}
                      aria-label="Confirm new account password"
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="text-xs text-destructive">{passwordErrors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={loadingPassword} className="rounded-lg h-10 px-5 font-semibold">
                    {loadingPassword ? (
                      <>
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        Changing...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
