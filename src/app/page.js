"use client";
import { useEffect, useState } from "react";
import CampaignCard from "../components/home/CampaignCard";
import HeroSlider from "../components/home/HeroSlider";
import TestimonialSlider from "../components/home/TestimonialSlider";
import { getTopFundedCampaigns } from "../services/campaignService";

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
      <HeroSlider />

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
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-8 text-center text-2xl font-bold">What Supporters Say</h2>
          <TestimonialSlider />
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
          <div className="hero-fade-in">
            <p className="text-3xl font-bold text-emerald-400">0</p>
            <p className="text-sm text-neutral-400">Active Campaigns</p>
          </div>
          <div className="hero-fade-in" style={{ animationDelay: "80ms" }}>
            <p className="text-3xl font-bold text-emerald-400">0</p>
            <p className="text-sm text-neutral-400">Total Supporters</p>
          </div>
          <div className="hero-fade-in" style={{ animationDelay: "160ms" }}>
            <p className="text-3xl font-bold text-emerald-400">0</p>
            <p className="text-sm text-neutral-400">Credits Raised</p>
          </div>
          <div className="hero-fade-in" style={{ animationDelay: "240ms" }}>
            <p className="text-3xl font-bold text-emerald-400">0</p>
            <p className="text-sm text-neutral-400">Successful Projects</p>
          </div>
        </div>
      </section>
    </div>
  );
}