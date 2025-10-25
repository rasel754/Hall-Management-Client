import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRoleStore } from "@/store/useRoleStore";
import { toast } from "sonner";

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useRoleStore();

  useEffect(() => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  }, [logout, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Logging out...</p>
    </div>
  );
};

export default Logout;
