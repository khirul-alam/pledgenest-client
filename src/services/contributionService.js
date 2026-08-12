export async function createContribution(axiosSecure, { campaign_id, contribution_amount }) {
  const res = await axiosSecure.post("/contributions", { campaign_id, contribution_amount });
  return res.data;
}

export async function getSupporterStats(axiosSecure, email) {
  const res = await axiosSecure.get(`/supporter-stats/${email}`);
  return res.data;
}

export async function getApprovedContributions(axiosSecure, email) {
  const res = await axiosSecure.get(`/contributions/supporter/${email}/approved`);
  return res.data;
}

export async function getMyContributions(axiosSecure, email, { page = 1, limit = 10 } = {}) {
  const res = await axiosSecure.get(`/contributions/supporter/${email}`, {
    params: { page, limit },
  });
  return res.data;
}
export async function getContributionsToReview(axiosSecure, email, status = "pending") {
  const res = await axiosSecure.get(`/contributions/creator/${email}`, { params: { status } });
  return res.data;
}

export async function approveContribution(axiosSecure, id) {
  const res = await axiosSecure.patch(`/contributions/${id}/approve`);
  return res.data;
}

export async function rejectContribution(axiosSecure, id) {
  const res = await axiosSecure.patch(`/contributions/${id}/reject`);
  return res.data;
}