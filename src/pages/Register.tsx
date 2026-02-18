import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRoleStore } from "@/store/useRoleStore";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { authService } from "@/services/auth.service";
import { Loader2 } from "lucide-react";
import axios, { AxiosError } from "axios";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        studentId: "",
        phoneNumber: "",
        address: "",
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { setAuth } = useRoleStore();

    // Client-side validation
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required";
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Please provide a valid email";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the errors in the form");
            return;
        }

        setLoading(true);

        try {
            // Prepare data for API (exclude confirmPassword, add default role)
            const { confirmPassword, ...registerData } = formData;

            const response = await authService.register({
                ...registerData,
                role: "student", // Always register as student
            });

            if (response.success) {
                const { token, user } = response.data;
                setAuth(token, user);
                toast.success(`Account created successfully! Welcome ${user.name || formData.firstName}!`);
                navigate(user.role === "student" ? "/student/my-room" : "/admin/overview");
            }
        } catch (error) {
            let errorMessage = "Registration failed. Please try again.";

            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                errorMessage = (axiosError.response?.data as { message?: string })?.message || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Card className="w-full max-w-2xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
                        <CardDescription className="text-center">
                            Enter your information to create a new account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleRegister} className="space-y-4">
                            {/* Name Fields - Side by Side */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">
                                        First Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="firstName"
                                        type="text"
                                        placeholder="John"
                                        value={formData.firstName}
                                        onChange={(e) => handleChange("firstName", e.target.value)}
                                        disabled={loading}
                                        className={errors.firstName ? "border-destructive" : ""}
                                        autoComplete="given-name"
                                    />
                                    {errors.firstName && (
                                        <p className="text-sm text-destructive">{errors.firstName}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lastName">
                                        Last Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="lastName"
                                        type="text"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={(e) => handleChange("lastName", e.target.value)}
                                        disabled={loading}
                                        className={errors.lastName ? "border-destructive" : ""}
                                        autoComplete="family-name"
                                    />
                                    {errors.lastName && (
                                        <p className="text-sm text-destructive">{errors.lastName}</p>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">
                                    Email <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your.email@university.edu"
                                    value={formData.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    disabled={loading}
                                    className={errors.email ? "border-destructive" : ""}
                                    autoComplete="email"
                                />
                                {errors.email && (
                                    <p className="text-sm text-destructive">{errors.email}</p>
                                )}
                            </div>

                            {/* Password Fields - Side by Side */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">
                                        Password <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Min. 6 characters"
                                        value={formData.password}
                                        onChange={(e) => handleChange("password", e.target.value)}
                                        disabled={loading}
                                        className={errors.password ? "border-destructive" : ""}
                                        autoComplete="new-password"
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-destructive">{errors.password}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">
                                        Confirm Password <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Confirm password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleChange("confirmPassword", e.target.value)}
                                        disabled={loading}
                                        className={errors.confirmPassword ? "border-destructive" : ""}
                                        autoComplete="new-password"
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                                    )}
                                </div>
                            </div>

                            {/* Student ID and Phone - Side by Side */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="studentId">Student ID</Label>
                                    <Input
                                        id="studentId"
                                        type="text"
                                        placeholder="2024001"
                                        value={formData.studentId}
                                        onChange={(e) => handleChange("studentId", e.target.value)}
                                        disabled={loading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phoneNumber">Phone Number</Label>
                                    <Input
                                        id="phoneNumber"
                                        type="tel"
                                        placeholder="1234567890"
                                        value={formData.phoneNumber}
                                        onChange={(e) => handleChange("phoneNumber", e.target.value)}
                                        disabled={loading}
                                        autoComplete="tel"
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    type="text"
                                    placeholder="123 University Ave"
                                    value={formData.address}
                                    onChange={(e) => handleChange("address", e.target.value)}
                                    disabled={loading}
                                    autoComplete="street-address"
                                />
                            </div>

                            {/* Submit Button */}
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>

                            {/* Login Link */}
                            <div className="text-center text-sm">
                                <span className="text-muted-foreground">Already have an account? </span>
                                <Link
                                    to="/login"
                                    className="text-primary hover:underline font-medium"
                                    tabIndex={loading ? -1 : 0}
                                >
                                    Login here
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default Register;
