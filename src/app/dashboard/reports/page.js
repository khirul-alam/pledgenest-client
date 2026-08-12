"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { getReportsAdmin, resolveReport } from "../../../services/reportService";
import { suspendCampaign, deleteCampaignAdmin } from "../../../services/campaignService";

export default function ReportsPage() {
  const axiosSecure = useAxiosSecure();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);

  const loadReports = () => {
    setLoading(true);
    getReportsAdmin(axiosSecure)
      .then(setReports)
      .catch((err) => console.error("Failed to load reports:", err.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadReports, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSuspend = async (report) => {
    setActioningId(report._id);
    try {
      await suspendCampaign(axiosSecure, report.campaign_id);
      await resolveReport(axiosSecure, report._id);
      toast.success("Campaign suspended and report resolved");
      loadReports();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to suspend campaign");
    } finally {
      setActioningId(null);
    }
  };

  const handleDeleteCampaign = async (report) => {
    if (!confirm("Delete this campaign permanently?")) return;
    setActioningId(report._id);
    try {
      await deleteCampaignAdmin(axiosSecure, report.campaign_id);
      await resolveReport(axiosSecure, report._id);
      toast.success("Campaign deleted and report resolved");
      loadReports();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete campaign");
    } finally {
      setActioningId(null);
    }
  };

  const handleDismiss = async (report) => {
    setActioningId(report._id);
    try {
      await resolveReport(axiosSecure, report._id);
      toast.success("Report dismissed");
      loadReports();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to dismiss report");
    } finally {
      setActioningId(null);
    }
  };

  const pendingReports = reports.filter((r) => r.status === "pending");

  return (
    <div>
      <h1 className="text-2xl font-bold">Reports</h1>
      <p className="mt-1 text-sm text-neutral-400">
        Campaigns reported as suspicious or fraudulent by supporters.
      </p>

      <div className="mt-6">
        {loading ? (
          <p className="text-neutral-500">Loading...</p>
        ) : pendingReports.length === 0 ? (
          <p className="text-neutral-500">No pending reports.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-900 text-neutral-400">
                <tr>
                  <th className="px-4 py-3">Campaign</th>
                  <th className="px-4 py-3">Reporter</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {pendingReports.map((r) => (
                  <tr key={r._id}>
                    <td className="px-4 py-3">{r.campaign_title}</td>
                    <td className="px-4 py-3 text-neutral-400">{r.reporter_name}</td>
                    <td className="px-4 py-3 max-w-xs">{r.reason}</td>
                    <td className="px-4 py-3 text-neutral-400">{new Date(r.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleDismiss(r)}
                          disabled={actioningId === r._id}
                          className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs hover:border-neutral-500 disabled:opacity-50"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => handleSuspend(r)}
                          disabled={actioningId === r._id}
                          className="rounded-lg bg-yellow-500/90 px-3 py-1.5 text-xs font-medium text-neutral-950 hover:bg-yellow-500 disabled:opacity-50"
                        >
                          Suspend Campaign
                        </button>
                        <button
                          onClick={() => handleDeleteCampaign(r)}
                          disabled={actioningId === r._id}
                          className="rounded-lg bg-red-500/90 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-50"
                        >
                          Delete Campaign
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