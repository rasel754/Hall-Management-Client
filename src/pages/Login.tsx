import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid university email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { login, isLoggingIn } = useAuth();
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    login({
      email: data.email || "",
      password: data.password || "",
    });
  };

  const handleDemoLogin = (role: "student" | "admin") => {
    if (role === "student") {
      setValue("email", "john.doe@example.com");
      setValue("password", "password123");
      toast.info("Demo Student credentials loaded!");
    } else {
      setValue("email", "admin@example.com");
      setValue("password", "adminpassword123");
      toast.info("Demo Admin credentials loaded!");
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Password reset instructions sent to: " + forgotEmail);
    setShowForgotModal(false);
    setForgotEmail("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-10 left-10 w-44 h-44 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="border-border bg-card shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="space-y-1 bg-muted/20 pb-6 border-b border-border text-center">
            <Link to="/" className="text-3xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2 block">
              🏫 HallMS
            </Link>
            <CardTitle className="text-xl font-bold text-foreground">Welcome Back</CardTitle>
            <CardDescription className="text-xs">
              Log in with credentials to access your hall portal
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">University Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="name@university.edu"
                  {...register("email")}
                  className={errors.email ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                  disabled={isLoggingIn}
                  autoComplete="email"
                  aria-label="Your registered email address"
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password">Password</Label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs text-primary font-semibold hover:underline"
                    tabIndex={0}
                  >
                    Forgot Password?
                  </button>
                </div>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={errors.password ? "border-destructive focus-visible:ring-destructive rounded-lg h-10" : "rounded-lg h-10"}
                  disabled={isLoggingIn}
                  autoComplete="current-password"
                  aria-label="Your login password"
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full h-10 rounded-lg font-bold" disabled={isLoggingIn}>
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="relative flex items-center justify-center my-4">
              <span className="absolute w-full h-[1px] bg-border" />
              <span className="relative bg-card px-3 text-xs text-muted-foreground font-semibold">
                OR
              </span>
            </div>

            {/* Google OAuth (UI only) */}
            <Button
              variant="outline"
              type="button"
              className="w-full h-10 rounded-lg font-semibold flex items-center justify-center gap-2 border-border bg-card hover:bg-muted/50 text-foreground"
              onClick={() => toast.info("Google OAuth login triggered (UI only).")}
              disabled={isLoggingIn}
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </Button>

            {/* Demo buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="outline"
                type="button"
                className="h-9 text-xs rounded-lg font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                onClick={() => handleDemoLogin("student")}
                disabled={isLoggingIn}
              >
                Demo Student
              </Button>
              <Button
                variant="outline"
                type="button"
                className="h-9 text-xs rounded-lg font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/20"
                onClick={() => handleDemoLogin("admin")}
                disabled={isLoggingIn}
              >
                Demo Admin
              </Button>
            </div>

            {/* Register link */}
            <div className="text-center text-xs pt-4 border-t border-border mt-4">
              <span className="text-muted-foreground font-medium">Don't have an account? </span>
              <Link to="/register" className="text-primary hover:underline font-bold">
                Register here
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-card border border-border p-6 rounded-xl shadow-xl space-y-4"
          >
            <div className="flex items-center gap-2 text-primary">
              <ShieldAlert className="h-6 w-6" />
              <h3 className="font-bold text-lg text-foreground">Recover Password</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter your university email address. If an account matches, password reset steps will be emailed.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">Email Address</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="name@university.edu"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="rounded-lg h-10"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowForgotModal(false)}
                  className="rounded-lg text-xs"
                >
                  Cancel
                </Button>
                <Button type="submit" className="rounded-lg text-xs font-semibold px-4">
                  Send Recovery Link
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}