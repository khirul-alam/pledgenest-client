export async function getCreatorEarnings(axiosSecure, email) {
  const res = await axiosSecure.get(`/creator-earnings/${email}`);
  return res.data;
}

export async function requestWithdrawal(axiosSecure, data) {
  const res = await axiosSecure.post("/withdrawals", data);
  return res.data;
}
export async function getPendingWithdrawalsAdmin(axiosSecure) {
  const res = await axiosSecure.get("/withdrawals-pending/admin");
  return res.data;
}

export async function approveWithdrawal(axiosSecure, id) {
  const res = await axiosSecure.patch(`/withdrawals/${id}/approve`);
  return res.data;
}