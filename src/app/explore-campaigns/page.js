"use client";
import { useEffect, useState } from "react";
import CampaignCard from "../../components/home/CampaignCard";
import { getApprovedCampaigns } from "../../services/campaignService";

const CATEGORIES = ["Technology", "Art", "Community", "Health", "Education", "Environment"];

export default function ExploreCampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    getApprovedCampaigns({ category: category || undefined, search: search || undefined })
      .then(setCampaigns)
      .catch((err) => console.error("Failed to load campaigns:", err.message))
      .finally(() => setLoading(false));
  }, [category, search]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-bold">Explore Campaigns</h1>
      <p className="mt-1 text-sm text-neutral-400">
        Discover active campaigns and support the ones you believe in.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search campaigns by title..."
          className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm outline-none focus:border-emerald-400"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm outline-none focus:border-emerald-400"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="mt-8">
        {loading ? (
          <p className="text-neutral-500">Loading campaigns...</p>
        ) : campaigns.length === 0 ? (
          <p className="text-neutral-500">No campaigns found. Try a different filter.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign._id} campaign={campaign} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}