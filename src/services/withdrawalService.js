export async function getCreatorEarnings(axiosSecure, email) {
  const res = await axiosSecure.get(`/creator-earnings/${email}`);
  return res.data;
}

export async function requestWithdrawal(axiosSecure, data) {
  const res = await axiosSecure.post("/withdrawals", data);
  return res.data;
}