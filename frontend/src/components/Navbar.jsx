import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between bg-blue-600 px-6 py-4 text-white">

      <h1 className="text-xl font-bold">
        User Management
      </h1>

      <div className="flex items-center gap-6">

        {user ? (
          <>
            <Link to="/home">Home</Link>

            <Link to="/profile">Profile</Link>

            {user.role === "admin" && (
              <Link to="/admin">
                Admin Dashboard
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="rounded bg-white px-3 py-1 text-blue-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>

            <Link to="/signup">Signup</Link>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;