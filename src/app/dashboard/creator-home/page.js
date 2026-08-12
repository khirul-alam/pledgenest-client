"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useRole from "../../../hooks/useRole";
import { getCreatorStats } from "../../../services/campaignService";
import {
  getContributionsToReview,
  approveContribution,
  rejectContribution,
} from "../../../services/contributionService";

export default function CreatorHomePage() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { refetchRole } = useRole();

  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState(null);
  const [actioningId, setActioningId] = useState(null);

  const loadData = () => {
    if (!user?.email) return;
    setLoading(true);
    Promise.all([
      getCreatorStats(axiosSecure, user.email),
      getContributionsToReview(axiosSecure, user.email, "pending"),
    ])
      .then(([statsRes, pendingRes]) => {
        setStats(statsRes);
        setPending(pendingRes);
      })
      .catch((err) => console.error("Failed to load creator home:", err.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadData, [user?.email]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApprove = async (id) => {
    setActioningId(id);
    try {
      await approveContribution(axiosSecure, id);
      toast.success("Contribution approved");
      setViewing(null);
      loadData();
      refetchRole();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to approve");
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (id) => {
    setActioningId(id);
    try {
      await rejectContribution(axiosSecure, id);
      toast.success("Contribution rejected and credits refunded to supporter");
      setViewing(null);
      loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to reject");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome back, {user?.displayName?.split(" ")[0]}</h1>
      <p className="mt-1 text-sm text-neutral-400">Here&apos;s how your campaigns are doing.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Campaigns" value={stats?.totalCampaigns ?? "—"} />
        <StatCard label="Active Campaigns" value={stats?.activeCampaigns ?? "—"} />
        <StatCard label="Total Raised" value={`${stats?.totalRaised ?? "—"} credits`} />
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Contributions To Review</h2>
        {loading ? (
          <p className="text-neutral-500">Loading...</p>
        ) : pending.length === 0 ? (
          <p className="text-neutral-500">No pending contributions right now.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-900 text-neutral-400">
                <tr>
                  <th className="px-4 py-3">Supporter</th>
                  <th className="px-4 py-3">Campaign</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {pending.map((c) => (
                  <tr key={c._id}>
                    <td className="px-4 py-3">{c.supporter_name}</td>
                    <td className="px-4 py-3">{c.campaign_title}</td>
                    <td className="px-4 py-3">{c.contribution_amount} credits</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => setViewing(c)} className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs hover:border-neutral-500">
                          View
                        </button>
                        <button onClick={() => handleApprove(c._id)} disabled={actioningId === c._id} className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-neutral-950 hover:bg-emerald-400 disabled:opacity-50">
                          Approve
                        </button>
                        <button onClick={() => handleReject(c._id)} disabled={actioningId === c._id} className="rounded-lg bg-red-500/90 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-50">
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

      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-6">
            <h3 className="text-lg font-semibold">Contribution Details</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <Row label="Supporter" value={viewing.supporter_name} />
              <Row label="Email" value={viewing.supporter_email} />
              <Row label="Campaign" value={viewing.campaign_title} />
              <Row label="Amount" value={`${viewing.contribution_amount} credits`} />
              <Row label="Date" value={new Date(viewing.current_date).toLocaleString()} />
            </dl>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setViewing(null)} className="rounded-lg border border-neutral-700 px-4 py-2 text-sm hover:border-neutral-500">
                Close
              </button>
              <button onClick={() => handleReject(viewing._id)} disabled={actioningId === viewing._id} className="rounded-lg bg-red-500/90 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50">
                Reject
              </button>
              <button onClick={() => handleApprove(viewing._id)} disabled={actioningId === viewing._id} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-emerald-400 disabled:opacity-50">
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b border-neutral-800 pb-2">
      <dt className="text-neutral-500">{label}</dt>
      <dd className="text-right">{value}</dd>
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