export async function getAllUsersAdmin(axiosSecure) {
  const res = await axiosSecure.get("/users-all/admin");
  return res.data;
}

export async function updateUserRole(axiosSecure, id, role) {
  const res = await axiosSecure.patch(`/users/${id}/role`, { role });
  return res.data;
}

export async function deleteUser(axiosSecure, id) {
  const res = await axiosSecure.delete(`/users/${id}`);
  return res.data;
}