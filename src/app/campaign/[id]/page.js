"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { getCampaignById } from "../../../services/campaignService";
import { createContribution } from "../../../services/contributionService";
import useAuth from "../../../hooks/useAuth";
import useRole from "../../../hooks/useRole";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { role, credits, refetchRole } = useRole();
  const axiosSecure = useAxiosSecure();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");

  useEffect(() => {
    getCampaignById(id)
      .then(setCampaign)
      .catch(() => toast.error("Campaign not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleContribute = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to contribute");
      router.push("/login");
      return;
    }
    if (role !== "supporter") {
      toast.error("Only supporters can contribute to campaigns");
      return;
    }

    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (numericAmount < campaign.minimum_contribution) {
      toast.error(`Minimum contribution is ${campaign.minimum_contribution} credits`);
      return;
    }
    if (numericAmount > credits) {
      toast.error("You don't have enough credits");
      return;
    }

    setSubmitting(true);
    try {
      await createContribution(axiosSecure, {
        campaign_id: campaign._id,
        contribution_amount: numericAmount,
      });
      toast.success("Contribution submitted! Waiting for creator approval.");
      setAmount("");
      refetchRole();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to contribute");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReport = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to report a campaign");
      return;
    }
    if (reportReason.trim().length < 5) {
      toast.error("Please describe the issue (at least 5 characters)");
      return;
    }
    try {
      await axiosSecure.post("/reports", {
        campaign_id: campaign._id,
        campaign_title: campaign.campaign_title,
        reason: reportReason.trim(),
      });
      toast.success("Report submitted. Our team will review it.");
      setReportOpen(false);
      setReportReason("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to submit report");
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-neutral-500">Loading campaign...</div>;
  }

  if (!campaign) {
    return (
      <div className="p-10 text-center">
        <p className="text-neutral-400">Campaign not found.</p>
        <Link href="/explore-campaigns" className="text-emerald-400 hover:underline">
          Back to Explore Campaigns
        </Link>
      </div>
    );
  }

  const progress = Math.min(100, Math.round((campaign.amount_raised / campaign.funding_goal) * 100) || 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="aspect-video w-full overflow-hidden rounded-xl bg-neutral-800">
            {campaign.campaign_image_url && (
              <img src={campaign.campaign_image_url} alt={campaign.campaign_title} className="h-full w-full object-cover" />
            )}
          </div>

          <span className="mt-4 inline-block text-xs font-medium text-emerald-400">{campaign.category}</span>
          <h1 className="mt-1 text-2xl font-bold">{campaign.campaign_title}</h1>
          <p className="mt-1 text-sm text-neutral-400">by {campaign.creator_name}</p>

          <div className="mt-6 whitespace-pre-line text-neutral-300">{campaign.campaign_story}</div>

          {campaign.reward_info && (
            <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
              <h3 className="font-semibold">What supporters get</h3>
              <p className="mt-1 text-sm text-neutral-400">{campaign.reward_info}</p>
            </div>
          )}

          {user && (
            <button onClick={() => setReportOpen((prev) => !prev)} className="mt-6 text-xs text-neutral-500 hover:text-red-400">
              Report this campaign
            </button>
          )}

          {reportOpen && (
            <form onSubmit={handleReport} className="mt-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
              <label className="mb-1 block text-sm text-neutral-300">
                Why do you think this campaign is suspicious or fraudulent?
              </label>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                placeholder="Describe the issue..."
              />
              <button type="submit" className="mt-2 rounded-full bg-red-500/90 px-4 py-2 text-sm font-medium text-white hover:bg-red-500">
                Submit Report
              </button>
            </form>
          )}
        </div>

        <div>
          <div className="sticky top-20 rounded-xl border border-neutral-800 bg-neutral-900 p-5">
            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800">
              <div className="h-full bg-emerald-500" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold">{campaign.amount_raised || 0}</span>
              <span className="text-sm text-neutral-400">of {campaign.funding_goal} credits</span>
            </div>
            <p className="mt-1 text-xs text-neutral-500">Deadline: {campaign.deadline}</p>
            <p className="mt-1 text-xs text-neutral-500">Minimum contribution: {campaign.minimum_contribution} credits</p>

            <form onSubmit={handleContribute} className="mt-5 flex flex-col gap-3">
              <label className="text-sm text-neutral-300">Contribution amount (credits)</label>
              <input
                type="number"
                min={campaign.minimum_contribution}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Min ${campaign.minimum_contribution}`}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-2 outline-none focus:border-emerald-400"
              />
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-emerald-500 px-4 py-3 font-medium text-neutral-950 hover:bg-emerald-400 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Contribute"}
              </button>
              {user && role === "supporter" && (
                <p className="text-center text-xs text-neutral-500">You have {credits ?? 0} credits available</p>
              )}
              {!user && (
                <p className="text-center text-xs text-neutral-500">
                  <Link href="/login" className="text-emerald-400 hover:underline">Login</Link> to contribute
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}