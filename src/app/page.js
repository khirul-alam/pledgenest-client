"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import CampaignCard from "../components/home/CampaignCard";
import { getTopFundedCampaigns } from "../services/campaignService";

const heroSlides = [
  {
    title: "From a good idea to a real project",
    subtitle: "Launch your campaign on PledgeNest and raise credits from supporters",
  },
];

export default function HomePage() {
  const [topCampaigns, setTopCampaigns] = useState([]);
  const [loadingTop, setLoadingTop] = useState(true);

  useEffect(() => {
    getTopFundedCampaigns()
      .then(setTopCampaigns)
      .catch((err) => console.error("Failed to load top campaigns:", err.message))
      .finally(() => setLoadingTop(false));
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-neutral-800 bg-gradient-to-b from-emerald-950/40 to-neutral-950 px-4 py-24 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
          {heroSlides[0].title}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-neutral-400">{heroSlides[0].subtitle}</p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/explore-campaigns" className="rounded-full bg-emerald-500 px-6 py-3 font-medium text-neutral-950 hover:bg-emerald-400">
            Explore Campaigns
          </Link>
          <Link href="/register" className="rounded-full border border-neutral-700 px-6 py-3 font-medium hover:border-emerald-400">
            Join as a Creator
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-8 text-2xl font-bold">Top Funded Campaigns</h2>
        {loadingTop ? (
          <p className="text-neutral-500">Loading campaigns...</p>
        ) : topCampaigns.length === 0 ? (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-neutral-500">
            No campaigns yet — be the first to launch one on PledgeNest.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {topCampaigns.map((campaign) => (
              <CampaignCard key={campaign._id} campaign={campaign} />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-neutral-800 bg-neutral-900/40 px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-8 text-2xl font-bold">What Supporters Say</h2>
          <p className="text-neutral-400">Testimonial slider coming soon</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-8 text-2xl font-bold">How It Works</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-neutral-800 p-6">
            <span className="text-emerald-400">01</span>
            <h3 className="mt-2 font-semibold">Register</h3>
            <p className="mt-1 text-sm text-neutral-400">Create an account as a Supporter or Creator and get free starting credits</p>
          </div>
          <div className="rounded-xl border border-neutral-800 p-6">
            <span className="text-emerald-400">02</span>
            <h3 className="mt-2 font-semibold">Find or Launch a Campaign</h3>
            <p className="mt-1 text-sm text-neutral-400">Support a project you care about, or launch a campaign for your own idea</p>
          </div>
          <div className="rounded-xl border border-neutral-800 p-6">
            <span className="text-emerald-400">03</span>
            <h3 className="mt-2 font-semibold">Track Progress</h3>
            <p className="mt-1 text-sm text-neutral-400">Follow every contribution and campaign update from your dashboard</p>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-800 px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-2xl font-bold">Explore by Category</h2>
          <div className="flex flex-wrap gap-3">
            {["Technology", "Art", "Community", "Health", "Education", "Environment"].map((cat) => (
              <span key={cat} className="rounded-full border border-neutral-700 px-4 py-2 text-sm text-neutral-300 hover:border-emerald-400 hover:text-emerald-400">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-8 text-2xl font-bold">Platform Impact in Numbers</h2>
        <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
          <div><p className="text-3xl font-bold text-emerald-400">0</p><p className="text-sm text-neutral-400">Active Campaigns</p></div>
          <div><p className="text-3xl font-bold text-emerald-400">0</p><p className="text-sm text-neutral-400">Total Supporters</p></div>
          <div><p className="text-3xl font-bold text-emerald-400">0</p><p className="text-sm text-neutral-400">Credits Raised</p></div>
          <div><p className="text-3xl font-bold text-emerald-400">0</p><p className="text-sm text-neutral-400">Successful Projects</p></div>
        </div>
      </section>
    </div>
  );
}