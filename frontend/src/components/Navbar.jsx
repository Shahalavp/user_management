import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const linkClasses =
    "text-sm font-medium text-slate-600 transition hover:text-slate-900";

  return (
    <nav className="border-b border-slate-200 bg-white px-6 py-3.5">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link
          to="/"
          className="text-base font-semibold tracking-tight text-slate-900"
        >
          User Management
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link to="/home" className={linkClasses}>
                Home
              </Link>

              {user.role === "admin" && (
                <Link to="/admin" className={linkClasses}>
                  Admin Dashboard
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClasses}>
                Login
              </Link>

              <Link
                to="/signup"
                className="rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;