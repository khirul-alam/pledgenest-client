import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getApprovedCampaigns({ category, search } = {}) {
  const res = await axios.get(`${API_URL}/campaigns`, { params: { category, search } });
  return res.data;
}

export async function getTopFundedCampaigns() {
  const res = await axios.get(`${API_URL}/campaigns/top-funded`);
  return res.data;
}

export async function getCampaignById(id) {
  const res = await axios.get(`${API_URL}/campaigns/${id}`);
  return res.data;
}
export async function createCampaign(axiosSecure, campaignData) {
  const res = await axiosSecure.post("/campaigns", campaignData);
  return res.data;
}

export async function getMyCampaigns(axiosSecure, email) {
  const res = await axiosSecure.get(`/campaigns/creator/${email}`);
  return res.data;
}

export async function updateCampaign(axiosSecure, id, updates) {
  const res = await axiosSecure.patch(`/campaigns/${id}`, updates);
  return res.data;
}

export async function deleteCampaign(axiosSecure, id) {
  const res = await axiosSecure.delete(`/campaigns/${id}`);
  return res.data;
}

export async function getCreatorStats(axiosSecure, email) {
  const res = await axiosSecure.get(`/creator-stats/${email}`);
  return res.data;
}
export async function getAllCampaignsAdmin(axiosSecure) {
  const res = await axiosSecure.get("/campaigns-all/admin");
  return res.data;
}

export async function deleteCampaignAdmin(axiosSecure, id) {
  const res = await axiosSecure.delete(`/campaigns/${id}/admin`);
  return res.data;
}

export async function suspendCampaign(axiosSecure, id) {
  const res = await axiosSecure.patch(`/campaigns/${id}/suspend`);
  return res.data;
}

export async function getPendingCampaignsAdmin(axiosSecure) {
  const res = await axiosSecure.get("/campaigns-pending/admin");
  return res.data;
}

export async function updateCampaignStatus(axiosSecure, id, status) {
  const res = await axiosSecure.patch(`/campaigns/${id}/status`, { status });
  return res.data;
}

export async function getAdminStats(axiosSecure) {
  const res = await axiosSecure.get("/admin-stats");
  return res.data;
}