import { useEffect, useState } from "react";
import api from "../services/api";

function AdminDashboard() {
  // ---------------- USERS ----------------
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------------- CREATE USER ----------------
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  // ---------------- EDIT USER ----------------
  const [showEditForm, setShowEditForm] = useState(false);
  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    email: "",
    role: "user",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  // ---------------- DELETE USER ----------------
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  // ---------------- FETCH USERS ----------------
  const fetchUsers = async (searchValue = "") => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/users", {
        params: { search: searchValue },
      });

      setUsers(response.data.users);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ---------------- SEARCH ----------------
  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(search);
  };

  const handleClear = () => {
    setSearch("");
    fetchUsers("");
  };

  // ---------------- CREATE USER ----------------
  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm({ ...createForm, [name]: value });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreateError("");

    if (!createForm.name || !createForm.email || !createForm.password) {
      return setCreateError("All fields are required.");
    }

    try {
      setCreateLoading(true);

      await api.post("/admin/users", createForm);

      setShowCreateForm(false);
      setCreateForm({
        name: "",
        email: "",
        password: "",
        role: "user",
      });

      await fetchUsers(search);
    } catch (err) {
      setCreateError(err.response?.data?.message || "Failed to create user");
    } finally {
      setCreateLoading(false);
    }
  };

  // ---------------- EDIT USER ----------------
  const handleEditClick = (user) => {
    setEditForm({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    setEditError("");
    setShowEditForm(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setEditError("");

    if (!editForm.name || !editForm.email || !editForm.role) {
      return setEditError("All fields are required.");
    }

    try {
      setEditLoading(true);

      await api.put(`/admin/users/${editForm.id}`, {
        name: editForm.name,
        email: editForm.email,
        role: editForm.role,
      });

      setShowEditForm(false);
      setEditForm({
        id: "",
        name: "",
        email: "",
        role: "user",
      });

      await fetchUsers(search);
    } catch (err) {
      setEditError(err.response?.data?.message || "Failed to update user");
    } finally {
      setEditLoading(false);
    }
  };

  // ---------------- DELETE USER ----------------
  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      setDeleteLoading(userId);
      setDeleteError("");

      await api.delete(`/admin/users/${userId}`);

      await fetchUsers(search);
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Failed to delete user");
    } finally {
      setDeleteLoading(null);
    }
  };

  // ---------------- HELPERS ----------------
  const initials = (name = "") =>
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");

  const adminCount = users.filter((u) => u.role === "admin").length;

  const animationStyles = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes modalIn {
      from { opacity: 0; transform: scale(0.97) translateY(4px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes overlayIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .fade-in-up { animation: fadeInUp 0.35s ease-out; }
    .modal-in { animation: modalIn 0.2s ease-out; }
    .overlay-in { animation: overlayIn 0.15s ease-out; }
  `;

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900" />
          <p className="text-sm text-gray-500">Loading users…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <style>{animationStyles}</style>

      <div className="fade-in-up mx-auto max-w-5xl px-6 py-10">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Users</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage accounts, roles, and access
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchUsers(search)}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3.5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                <path d="M21 3v6h-6" />
              </svg>
              Refresh
            </button>

            <button
              onClick={() => {
                setCreateError("");
                setShowCreateForm(true);
              }}
              className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-3.5 py-2 text-sm font-medium text-white transition-all hover:bg-black active:scale-[0.98]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add user
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Total users</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {users.length}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 p-5">
            <p className="text-sm text-gray-500">Admins</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {adminCount}
            </p>
          </div>
        </div>

        {/* ERRORS */}
        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {deleteError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {deleteError}
          </div>
        )}

        {/* TABLE CARD */}
        <div className="overflow-hidden rounded-lg border border-gray-200">
          {/* SEARCH BAR */}
          <div className="border-b border-gray-200 p-4">
            <form
              onSubmit={handleSearch}
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <div className="relative flex-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or email"
                  className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-gray-900 focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-black active:scale-[0.98]">
                  Search
                </button>
                {search && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    Clear
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* USERS TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-5 py-16 text-center">
                      <p className="text-sm font-medium text-gray-700">
                        No users found
                      </p>
                      {search && (
                        <p className="mt-1 text-sm text-gray-400">
                          Try a different search term.
                        </p>
                      )}
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-gray-100 transition-colors last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
                            {initials(user.name) || "?"}
                          </div>
                          <span className="font-medium text-gray-900">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(user)}
                            disabled={deleteLoading === user._id}
                            className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            disabled={deleteLoading === user._id}
                            className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                          >
                            {deleteLoading === user._id
                              ? "Deleting…"
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CREATE USER MODAL */}
      {showCreateForm && (
        <div className="overlay-in fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 px-4">
          <div className="modal-in w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">
                Create user
              </h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {createError && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={createForm.name}
                  onChange={handleCreateChange}
                  placeholder="Jane Doe"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-gray-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={createForm.email}
                  onChange={handleCreateChange}
                  placeholder="jane@company.com"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-gray-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={createForm.password}
                  onChange={handleCreateChange}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-gray-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  name="role"
                  value={createForm.role}
                  onChange={handleCreateChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-gray-900 focus:outline-none"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  disabled={createLoading}
                  className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-black active:scale-[0.98] disabled:opacity-60"
                >
                  {createLoading ? "Creating…" : "Create user"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {showEditForm && (
        <div className="overlay-in fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 px-4">
          <div className="modal-in w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">
                Edit user
              </h2>
              <button
                onClick={() => setShowEditForm(false)}
                className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {editError && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {editError}
              </div>
            )}

            <form onSubmit={handleUpdateUser} className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-gray-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-gray-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  name="role"
                  value={editForm.role}
                  onChange={handleEditChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-gray-900 focus:outline-none"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  disabled={editLoading}
                  className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-black active:scale-[0.98] disabled:opacity-60"
                >
                  {editLoading ? "Updating…" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;