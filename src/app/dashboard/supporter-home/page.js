"use client";
import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { getSupporterStats, getApprovedContributions } from "../../../services/contributionService";

export default function SupporterHomePage() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [stats, setStats] = useState(null);
  const [approved, setApproved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    Promise.all([
      getSupporterStats(axiosSecure, user.email),
      getApprovedContributions(axiosSecure, user.email),
    ])
      .then(([statsRes, approvedRes]) => {
        setStats(statsRes);
        setApproved(approvedRes);
      })
      .catch((err) => console.error("Failed to load supporter home:", err.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome back, {user?.displayName?.split(" ")[0]}</h1>
      <p className="mt-1 text-sm text-neutral-400">Here&apos;s a summary of your support so far.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Contributions" value={stats?.totalContributions ?? "—"} />
        <StatCard label="Pending Contributions" value={stats?.totalPending ?? "—"} />
        <StatCard label="Total Amount Contributed" value={`${stats?.totalAmountContributed ?? "—"} credits`} />
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Approved Contributions</h2>
        {loading ? (
          <p className="text-neutral-500">Loading...</p>
        ) : approved.length === 0 ? (
          <p className="text-neutral-500">You don&apos;t have any approved contributions yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-900 text-neutral-400">
                <tr>
                  <th className="px-4 py-3">Campaign</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Creator</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {approved.map((c) => (
                  <tr key={c._id}>
                    <td className="px-4 py-3">{c.campaign_title}</td>
                    <td className="px-4 py-3">{c.contribution_amount} credits</td>
                    <td className="px-4 py-3">{c.creator_name}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                        {c.status}
                      </span>
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