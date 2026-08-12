"use client";
import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { getMyContributions } from "../../../services/contributionService";

const STATUS_STYLES = {
  pending: "bg-yellow-500/10 text-yellow-400",
  approved: "bg-emerald-500/10 text-emerald-400",
  rejected: "bg-red-500/10 text-red-400",
};

export default function MyContributionsPage() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [data, setData] = useState({ contributions: [], totalPages: 1, currentPage: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    setLoading(true);
    getMyContributions(axiosSecure, user.email, { page, limit: 10 })
      .then(setData)
      .catch((err) => console.error("Failed to load contributions:", err.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email, page]);

  return (
    <div>
      <h1 className="text-2xl font-bold">My Contributions</h1>
      <p className="mt-1 text-sm text-neutral-400">Every contribution you&apos;ve made, across all campaigns.</p>

      <div className="mt-6">
        {loading ? (
          <p className="text-neutral-500">Loading...</p>
        ) : data.contributions.length === 0 ? (
          <p className="text-neutral-500">You haven&apos;t contributed to any campaign yet.</p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-neutral-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-900 text-neutral-400">
                  <tr>
                    <th className="px-4 py-3">Campaign</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Creator</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {data.contributions.map((c) => (
                    <tr key={c._id}>
                      <td className="px-4 py-3">{c.campaign_title}</td>
                      <td className="px-4 py-3">{c.contribution_amount} credits</td>
                      <td className="px-4 py-3">{c.creator_name}</td>
                      <td className="px-4 py-3 text-neutral-400">{new Date(c.current_date).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_STYLES[c.status] || ""}`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg border border-neutral-700 px-3 py-1.5 text-sm disabled:opacity-40">
                  Prev
                </button>
                {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`rounded-lg px-3 py-1.5 text-sm ${p === page ? "bg-emerald-500 text-neutral-950 font-medium" : "border border-neutral-700 text-neutral-300"}`}
                  >
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))} disabled={page === data.totalPages} className="rounded-lg border border-neutral-700 px-3 py-1.5 text-sm disabled:opacity-40">
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}