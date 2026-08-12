"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { getMyCampaigns, updateCampaign, deleteCampaign } from "../../../services/campaignService";

const STATUS_STYLES = {
  pending: "bg-yellow-500/10 text-yellow-400",
  approved: "bg-emerald-500/10 text-emerald-400",
  rejected: "bg-red-500/10 text-red-400",
  suspended: "bg-red-500/10 text-red-400",
};

export default function MyCampaignsPage() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const loadCampaigns = () => {
    if (!user?.email) return;
    setLoading(true);
    getMyCampaigns(axiosSecure, user.email)
      .then(setCampaigns)
      .catch((err) => console.error("Failed to load campaigns:", err.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadCampaigns, [user?.email]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    setSavingEdit(true);
    try {
      await updateCampaign(axiosSecure, editing._id, {
        campaign_title: form.campaign_title.value.trim(),
        campaign_story: form.campaign_story.value.trim(),
        reward_info: form.reward_info.value.trim(),
      });
      toast.success("Campaign updated");
      setEditing(null);
      loadCampaigns();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update campaign");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this campaign? Supporters with approved contributions will be refunded.")) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteCampaign(axiosSecure, id);
      toast.success("Campaign deleted and supporters refunded");
      loadCampaigns();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete campaign");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">My Campaigns</h1>
      <p className="mt-1 text-sm text-neutral-400">Manage the campaigns you&apos;ve launched.</p>

      <div className="mt-6">
        {loading ? (
          <p className="text-neutral-500">Loading...</p>
        ) : campaigns.length === 0 ? (
          <p className="text-neutral-500">You haven&apos;t launched any campaign yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-900 text-neutral-400">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Raised / Goal</th>
                  <th className="px-4 py-3">Deadline</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {campaigns.map((c) => (
                  <tr key={c._id}>
                    <td className="px-4 py-3">{c.campaign_title}</td>
                    <td className="px-4 py-3">{c.amount_raised || 0} / {c.funding_goal}</td>
                    <td className="px-4 py-3 text-neutral-400">{c.deadline}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_STYLES[c.status] || ""}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => setEditing(c)} className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs hover:border-neutral-500">
                          Update
                        </button>
                        <button onClick={() => handleDelete(c._id)} disabled={deletingId === c._id} className="rounded-lg bg-red-500/90 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-50">
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

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <form onSubmit={handleUpdateSubmit} className="w-full max-w-lg rounded-xl border border-neutral-800 bg-neutral-900 p-6">
            <h3 className="text-lg font-semibold">Update Campaign</h3>
            <div className="mt-4 flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-sm text-neutral-300">Campaign Title</label>
                <input name="campaign_title" defaultValue={editing.campaign_title} className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-2 outline-none focus:border-emerald-400" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-neutral-300">Campaign Story</label>
                <textarea name="campaign_story" rows={4} defaultValue={editing.campaign_story} className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-2 outline-none focus:border-emerald-400" />
              </div>
              <div>
                <label className="mb-1 block text-sm text-neutral-300">Reward Info</label>
                <input name="reward_info" defaultValue={editing.reward_info} className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-2 outline-none focus:border-emerald-400" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-neutral-700 px-4 py-2 text-sm hover:border-neutral-500">
                Cancel
              </button>
              <button type="submit" disabled={savingEdit} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-emerald-400 disabled:opacity-50">
                {savingEdit ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}