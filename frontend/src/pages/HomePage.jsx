import { useEffect, useState } from "react";
import api from "../services/api";

function HomePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getHomeData = async () => {
      try {
        const response = await api.get("/user/home");

        console.log(response.data);

        setUser(response.data.user);

      } catch (error) {
        console.log(error);
      }
    };

    getHomeData();
  }, []);

  return (
    <main className="p-8">

      <h1 className="text-3xl font-bold">
        Home
      </h1>

      {user && (
        <div className="mt-6 rounded-lg border p-6">
          <h2 className="text-xl font-semibold">
            Welcome, {user.name}
          </h2>

          <p className="mt-2">
            Email: {user.email}
          </p>

          <p className="mt-1">
            Role: {user.role}
          </p>
        </div>
      )}

    </main>
  );
}

export default HomePage;