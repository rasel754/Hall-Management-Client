import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const registerSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Please enter a valid university email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  studentId: z.string().min(5, "Student ID must be at least 5 characters"),
  department: z.string().min(2, "Please select or type your department"),
  year: z.string().min(1, "Please select your study year"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm password must match"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const { register: registerUser, isRegistering } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormValues) => {
    registerUser({
      name: data.fullName.trim(),
      email: data.email,
      phone: data.phone,
      password: data.password,
      studentId: data.studentId,
      department: data.department,
      year: Number(data.year),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-44 h-44 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg"
      >
        <Card className="border-border bg-card shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="space-y-1 bg-muted/20 pb-6 border-b border-border text-center">
            <Link to="/" className="text-3xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2 block">
              🏫 HallMS
            </Link>
            <CardTitle className="text-xl font-bold text-foreground">Create Account</CardTitle>
            <CardDescription className="text-xs">
              Register as a student to request hall rooms and view notices
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="reg-name">Full Name</Label>
                <Input
                  id="reg-name"
                  type="text"
                  placeholder="John Doe"
                  {...register("fullName")}
                  className={errors.fullName ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                  disabled={isRegistering}
                  autoComplete="name"
                  aria-label="Your full name"
                />
                {errors.fullName && (
                  <p className="text-xs text-destructive">{errors.fullName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="reg-email">University Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="john.doe@university.edu"
                    {...register("email")}
                    className={errors.email ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                    disabled={isRegistering}
                    autoComplete="email"
                    aria-label="Your university email address"
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="reg-phone">Phone Number</Label>
                  <Input
                    id="reg-phone"
                    type="tel"
                    placeholder="+88017XXXXXXXX"
                    {...register("phone")}
                    className={errors.phone ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                    disabled={isRegistering}
                    autoComplete="tel"
                    aria-label="Your phone number"
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Student ID */}
                <div className="space-y-2">
                  <Label htmlFor="reg-studentid">Student ID</Label>
                  <Input
                    id="reg-studentid"
                    type="text"
                    placeholder="2026001"
                    {...register("studentId")}
                    className={errors.studentId ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                    disabled={isRegistering}
                    aria-label="Your student ID number"
                  />
                  {errors.studentId && (
                    <p className="text-xs text-destructive">{errors.studentId.message}</p>
                  )}
                </div>

                {/* Department */}
                <div className="space-y-2">
                  <Label htmlFor="reg-dept">Department</Label>
                  <Input
                    id="reg-dept"
                    type="text"
                    placeholder="Computer Science"
                    {...register("department")}
                    className={errors.department ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                    disabled={isRegistering}
                    aria-label="Your academic department"
                  />
                  {errors.department && (
                    <p className="text-xs text-destructive">{errors.department.message}</p>
                  )}
                </div>

                {/* Year */}
                <div className="space-y-2">
                  <Label htmlFor="reg-year">Study Year</Label>
                  <Select
                    value={watch("year")}
                    onValueChange={(val) => setValue("year", val)}
                  >
                    <SelectTrigger id="reg-year" className="w-full bg-card rounded-lg h-10 border-border">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Year 1 (Freshman)</SelectItem>
                      <SelectItem value="2">Year 2 (Sophomore)</SelectItem>
                      <SelectItem value="3">Year 3 (Junior)</SelectItem>
                      <SelectItem value="4">Year 4 (Senior)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.year && (
                    <p className="text-xs text-destructive">{errors.year.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                    className={errors.password ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                    disabled={isRegistering}
                    autoComplete="new-password"
                    aria-label="Create a password"
                  />
                  {errors.password && (
                    <p className="text-xs text-destructive">{errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="reg-confirmpass">Confirm Password</Label>
                  <Input
                    id="reg-confirmpass"
                    type="password"
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                    className={errors.confirmPassword ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                    disabled={isRegistering}
                    autoComplete="new-password"
                    aria-label="Confirm your password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full h-10 rounded-lg font-bold" disabled={isRegistering}>
                {isRegistering ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              <div className="text-center text-xs pt-4 border-t border-border mt-4">
                <span className="text-muted-foreground font-medium">Already have an account? </span>
                <Link to="/login" className="text-primary hover:underline font-bold">
                  Login here
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
