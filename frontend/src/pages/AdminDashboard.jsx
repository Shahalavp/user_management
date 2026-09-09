function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800">
        Admin Dashboard
      </h1>

      <div className="mt-6 rounded-xl bg-white p-6 shadow">
        <h2 className="text-xl font-semibold text-gray-800">
          Welcome, Admin
        </h2>

        <p className="mt-2 text-gray-600">
          You have access to the admin dashboard.
        </p>
      </div>
    </div>
  );
}

export default AdminDashboard;