import Link from "next/link";

// These will come from the backend API in a later phase (top funded campaigns logic).
// Kept static for now to show structure — real English copy, no Lorem ipsum.
const heroSlides = [
  {
    title: "From a good idea to a real project",
    subtitle: "Launch your campaign on PledgeNest and raise credits from supporters",
  },
  {
    title: "Every credit contributes to someone's dream",
    subtitle: "Start with 50 free credits, support the campaigns you believe in",
  },
  {
    title: "Transparent, secure, community-driven",
    subtitle: "Every campaign is admin-approved, every transaction is trackable",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-neutral-800 bg-gradient-to-b from-emerald-950/40 to-neutral-950 px-4 py-24 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
          {heroSlides[0].title}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-neutral-400">{heroSlides[0].subtitle}</p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/explore-campaigns"
            className="rounded-full bg-emerald-500 px-6 py-3 font-medium text-neutral-950 hover:bg-emerald-400"
          >
            Explore Campaigns
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-neutral-700 px-6 py-3 font-medium hover:border-emerald-400"
          >
            Join as a Creator
          </Link>
        </div>
        {/* 💡 Next phase: replace with a real Swiper slider (3 slides) + animation */}
      </section>

      {/* Top Funded Campaigns */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-8 text-2xl font-bold">Top Funded Campaigns</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* 💡 Will fetch top 6 campaigns from backend and render cards (Phase 5/6) */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-neutral-500">
            Campaign data isn&apos;t connected yet — it will appear here once the Campaign API is wired up
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-neutral-800 bg-neutral-900/40 px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-8 text-2xl font-bold">What Supporters Say</h2>
          {/* 💡 Static testimonials via Swiper Slider */}
          <p className="text-neutral-400">Testimonial slider coming soon</p>
        </div>
      </section>

      {/* Extra Section 1: How It Works */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-8 text-2xl font-bold">How It Works</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-neutral-800 p-6">
            <span className="text-emerald-400">01</span>
            <h3 className="mt-2 font-semibold">Register</h3>
            <p className="mt-1 text-sm text-neutral-400">
              Create an account as a Supporter or Creator and get free starting credits
            </p>
          </div>
          <div className="rounded-xl border border-neutral-800 p-6">
            <span className="text-emerald-400">02</span>
            <h3 className="mt-2 font-semibold">Find or Launch a Campaign</h3>
            <p className="mt-1 text-sm text-neutral-400">
              Support a project you care about, or launch a campaign for your own idea
            </p>
          </div>
          <div className="rounded-xl border border-neutral-800 p-6">
            <span className="text-emerald-400">03</span>
            <h3 className="mt-2 font-semibold">Track Progress</h3>
            <p className="mt-1 text-sm text-neutral-400">
              Follow every contribution and campaign update from your dashboard
            </p>
          </div>
        </div>
      </section>

      {/* Extra Section 2: Explore by Category */}
      <section className="border-t border-neutral-800 px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-2xl font-bold">Explore by Category</h2>
          <div className="flex flex-wrap gap-3">
            {["Technology", "Art", "Community", "Health", "Education", "Environment"].map(
              (cat) => (
                <span
                  key={cat}
                  className="rounded-full border border-neutral-700 px-4 py-2 text-sm text-neutral-300 hover:border-emerald-400 hover:text-emerald-400"
                >
                  {cat}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* Extra Section 3: Platform Impact */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-8 text-2xl font-bold">Platform Impact in Numbers</h2>
        <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
          <div>
            <p className="text-3xl font-bold text-emerald-400">0</p>
            <p className="text-sm text-neutral-400">Active Campaigns</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-emerald-400">0</p>
            <p className="text-sm text-neutral-400">Total Supporters</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-emerald-400">0</p>
            <p className="text-sm text-neutral-400">Credits Raised</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-emerald-400">0</p>
            <p className="text-sm text-neutral-400">Successful Projects</p>
          </div>
        </div>
        {/* 💡 These numbers will become dynamic from the backend later */}
      </section>
    </div>
  );
}
