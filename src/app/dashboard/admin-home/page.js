"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  getAdminStats,
  getPendingCampaignsAdmin,
  updateCampaignStatus,
} from "../../../services/campaignService";

export default function AdminHomePage() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);

  const loadData = () => {
    setLoading(true);
    Promise.all([getAdminStats(axiosSecure), getPendingCampaignsAdmin(axiosSecure)])
      .then(([statsRes, pendingRes]) => {
        setStats(statsRes);
        setPending(pendingRes);
      })
      .catch((err) => console.error("Failed to load admin home:", err.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadData, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDecision = async (id, status) => {
    setActioningId(id);
    try {
      await updateCampaignStatus(axiosSecure, id, status);
      toast.success(`Campaign ${status}`);
      loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Action failed");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome back, {user?.displayName?.split(" ")[0]}</h1>
      <p className="mt-1 text-sm text-neutral-400">An overview of the PledgeNest platform.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Supporters" value={stats?.totalSupporters ?? "—"} />
        <StatCard label="Total Creators" value={stats?.totalCreators ?? "—"} />
        <StatCard label="Total Available Credits" value={stats?.totalAvailableCredits ?? "—"} />
        <StatCard label="Total Payments Processed" value={stats?.totalPayments ?? "—"} />
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Campaign Approvals</h2>
        {loading ? (
          <p className="text-neutral-500">Loading...</p>
        ) : pending.length === 0 ? (
          <p className="text-neutral-500">No campaigns waiting for approval.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-900 text-neutral-400">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Creator</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Goal</th>
                  <th className="px-4 py-3">Deadline</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {pending.map((c) => (
                  <tr key={c._id}>
                    <td className="px-4 py-3">{c.campaign_title}</td>
                    <td className="px-4 py-3">{c.creator_name}</td>
                    <td className="px-4 py-3">{c.category}</td>
                    <td className="px-4 py-3">{c.funding_goal} credits</td>
                    <td className="px-4 py-3 text-neutral-400">{c.deadline}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
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
                          className="rounded-lg bg-red-500/90 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-50"
                        >
                          Reject
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

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      <p className="text-sm text-neutral-400">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}