import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute() {
  const { user, loading } = useAuth();

  // 1. Still checking authentication
  if (loading) {
    return <p>Checking authentication...</p>;
  }

  // 2. Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Logged in, but NOT an admin
  if (user.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  // 4. Logged in AND admin
  return <Outlet />;
}

export default AdminRoute;