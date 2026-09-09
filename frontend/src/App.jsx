import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";

import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>

        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>

          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />

        </Route>

        {/* Admin routes */}
        <Route element={<AdminRoute />}>

          <Route path="/admin" element={<AdminDashboard />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;