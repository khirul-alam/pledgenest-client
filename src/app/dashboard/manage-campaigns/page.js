"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  getAllCampaignsAdmin,
  deleteCampaignAdmin,
  updateCampaignStatus,
} from "../../../services/campaignService";

const STATUS_STYLES = {
  pending: "bg-yellow-500/10 text-yellow-400",
  approved: "bg-emerald-500/10 text-emerald-400",
  rejected: "bg-red-500/10 text-red-400",
  suspended: "bg-red-500/10 text-red-400",
};

export default function ManageCampaignsPage() {
  const axiosSecure = useAxiosSecure();

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);

  const loadCampaigns = () => {
    setLoading(true);
    getAllCampaignsAdmin(axiosSecure)
      .then(setCampaigns)
      .catch((err) => console.error("Failed to load campaigns:", err.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadCampaigns, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (id) => {
    if (!confirm("Delete this campaign permanently?")) return;
    setActioningId(id);
    try {
      await deleteCampaignAdmin(axiosSecure, id);
      toast.success("Campaign deleted");
      loadCampaigns();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete campaign");
    } finally {
      setActioningId(null);
    }
  };

  const handleDecision = async (id, status) => {
    setActioningId(id);
    try {
      await updateCampaignStatus(axiosSecure, id, status);
      toast.success(`Campaign ${status}`);
      loadCampaigns();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Action failed");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Manage Campaigns</h1>
      <p className="mt-1 text-sm text-neutral-400">Every campaign on the platform, regardless of status.</p>

      <div className="mt-6">
        {loading ? (
          <p className="text-neutral-500">Loading...</p>
        ) : campaigns.length === 0 ? (
          <p className="text-neutral-500">No campaigns yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-900 text-neutral-400">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Creator</th>
                  <th className="px-4 py-3">Raised / Goal</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {campaigns.map((c) => (
                  <tr key={c._id}>
                    <td className="px-4 py-3">{c.campaign_title}</td>
                    <td className="px-4 py-3 text-neutral-400">{c.creator_name}</td>
                    <td className="px-4 py-3">{c.amount_raised || 0} / {c.funding_goal}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_STYLES[c.status] || ""}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {c.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleDecision(c._id, "approved")}
                              disabled={actioningId === c._id}
                              className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-neutral-950 hover:bg-emerald-400 disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleDecision(c._id, "rejected")}
                              disabled={actioningId === c._id}
                              className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs hover:border-neutral-500 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(c._id)}
                          disabled={actioningId === c._id}
                          className="rounded-lg bg-red-500/90 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
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