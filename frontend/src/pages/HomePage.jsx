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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-600">
          Loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-600">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="mb-4 text-3xl font-bold">
        Welcome, {user?.name}
      </h1>

      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
    </div>
  );
}

export default HomePage;