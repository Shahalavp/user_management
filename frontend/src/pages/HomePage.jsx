import { useEffect, useState } from "react";
import api from "../services/api";

function HomePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getHomeData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/user/home");

        setUser(response.data.user);
      } catch (error) {
        console.log(error);

        setError(
          error.response?.data?.message ||
          "Unable to load home page"
        );
      } finally {
        setLoading(false);
      }
    };

    getHomeData();
  }, []);

  const initials = (name = "") =>
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900" />
          <p className="text-sm text-gray-500">Loading…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="w-full max-w-sm rounded-md border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fadeInUp 0.35s ease-out; }
      `}</style>

      <div className="fade-in-up mx-auto max-w-4xl px-6 py-10">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Welcome, {user?.name}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here's your account overview
          </p>
        </div>

        <div className="mt-6 rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
              {initials(user?.name) || "?"}
            </div>
            <div>
              <p className="font-medium text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 pt-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-gray-500">Email</dt>
              <dd className="mt-1 text-sm font-medium text-gray-900">
                {user?.email}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Role</dt>
              <dd className="mt-1">
                <span className="inline-flex items-center rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                  {user?.role}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

export default HomePage;