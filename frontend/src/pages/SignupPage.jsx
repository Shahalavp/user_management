import api from "../services/api";

import { useState } from "react";
import { Link } from "react-router-dom";

function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
        !formData.name ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword
    ) {
        alert("Please fill all fields");
        return;
    }

    if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    try {
        const response = await api.post("/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        });

        console.log(response.data);

    } catch (error) {
        console.log(error);
    }
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">

        <h1 className="text-center text-3xl font-bold text-gray-800">
          Create Account
        </h1>

        <p className="mt-2 text-center text-gray-500">
          Sign up to get started
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            Create Account
          </button>

        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default SignupPage;