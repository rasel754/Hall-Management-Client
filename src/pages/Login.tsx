// import { useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useRoleStore } from "@/store/useRoleStore";
// import { toast } from "sonner";
// import { motion } from "framer-motion";
// import { authService } from "@/services/auth.service";
// import { Loader2 } from "lucide-react";

// const Login = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { setAuth } = useRoleStore();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!email || !password) {
//       toast.error("Please fill in all fields");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await authService.login({ email, password });

//       if (response.success) {
//         const { token, user } = response.data;
//         setAuth(token, user);
//         toast.success(`Welcome ${user.name}!`);
//         navigate(user.role === "student" ? "/student/my-room" : "/admin/overview");
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || "Login failed. Please check your credentials.";
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.3 }}
//       >
//         <Card className="w-full max-w-md">
//           <CardHeader className="space-y-1">
//             <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
//             <CardDescription className="text-center">
//               Enter your credentials to access the dashboard
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleLogin} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="your.email@university.edu"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   disabled={loading}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <Input
//                   id="password"
//                   type="password"
//                   placeholder="Enter your password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   disabled={loading}
//                 />
//               </div>

//               <Button type="submit" className="w-full" disabled={loading}>
//                 {loading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Logging in...
//                   </>
//                 ) : (
//                   "Login"
//                 )}
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   );
// };

// export default Login;



import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Fixed import style
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRoleStore } from "@/store/useRoleStore";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { authService } from "@/services/auth.service";
import { Loader2 } from "lucide-react";
// Import Axios error type for safer error checking
import axios, { AxiosError } from 'axios';

const Login = () => {
  // const [searchParams] = useSearchParams(); // Removed unused import
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useRoleStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login({ email, password });

      if (response.success) {

        const responseData = response.data as any; // Cast to any to allow checking unknown properties


        // Fallback to accessToken if token is missing
        const token = responseData.token || responseData.accessToken;
        const user = responseData.user;


        setAuth(token, user);

        toast.success(`Welcome ${user?.name || 'User'}!`);
        // Use full path for navigation clarity
        navigate(user?.role === "student" ? "/student/my-room" : "/admin/overview");
      }
    } catch (error) {
      let errorMessage = "Login failed. Please check your credentials.";

      // 🎯 FIX: Safer Axios error handling to prevent runtime crash
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        // Access nested message safely
        errorMessage = (axiosError.response?.data as { message?: string })?.message || errorMessage;
      } else if (error instanceof Error) {
        // Fallback for generic JS errors
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
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="username" // Added for accessibility
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="current-password" // Added for accessibility
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>

              {/* Register Link */}
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Link
                  to="/register"
                  className="text-primary hover:underline font-medium"
                  tabIndex={loading ? -1 : 0}
                >
                  Register here
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;