import { useEffect, useState } from "react";
import api from "../services/api";

function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await api.get("/user/profile");

        setUser(response.data.user);

      } catch (error) {
        console.log(error);
      }
    };

    getProfile();
  }, []);

  return (
    <main className="p-8">

      <h1 className="text-3xl font-bold">
        Profile
      </h1>

      {user && (
        <div className="mt-6 rounded-lg border p-6">

          <p>
            <strong>Name:</strong> {user.name}
          </p>

          <p className="mt-2">
            <strong>Email:</strong> {user.email}
          </p>

          <p className="mt-2">
            <strong>Role:</strong> {user.role}
          </p>

        </div>
      )}

    </main>
  );
}

export default ProfilePage;