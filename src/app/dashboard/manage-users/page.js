"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { getAllUsersAdmin, updateUserRole, deleteUser } from "../../../services/adminUserService";

const ROLES = ["supporter", "creator", "admin"];

export default function ManageUsersPage() {
  const { user: currentUser } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadUsers = () => {
    setLoading(true);
    getAllUsersAdmin(axiosSecure)
      .then(setUsers)
      .catch((err) => console.error("Failed to load users:", err.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadUsers, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRoleChange = async (id, role) => {
    setUpdatingId(id);
    try {
      await updateUserRole(axiosSecure, id, role);
      toast.success("Role updated");
      loadUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (id, email) => {
    if (email === currentUser?.email) {
      toast.error("You can't remove your own account");
      return;
    }
    if (!confirm("Remove this user permanently?")) return;

    setUpdatingId(id);
    try {
      await deleteUser(axiosSecure, id);
      toast.success("User removed");
      loadUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to remove user");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Manage Users</h1>
      <p className="mt-1 text-sm text-neutral-400">View and manage every registered user.</p>

      <div className="mt-6">
        {loading ? (
          <p className="text-neutral-500">Loading...</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-900 text-neutral-400">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Credits</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={u.photoURL || "https://i.ibb.co/2d1yv0J/default-avatar.png"}
                          alt={u.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        {u.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-400">{u.email}</td>
                    <td className="px-4 py-3">{u.credits}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        disabled={updatingId === u._id}
                        className="rounded-lg border border-neutral-700 bg-neutral-950 px-2 py-1 text-xs capitalize outline-none focus:border-emerald-400"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleRemove(u._id, u.email)}
                        disabled={updatingId === u._id}
                        className="rounded-lg bg-red-500/90 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}