import Link from "next/link";

// এই ডেটাগুলো পরের ফেজে backend API থেকে আসবে (top funded campaigns লজিক সহ)।
// এখন structure দেখানোর জন্য স্ট্যাটিক রাখা হয়েছে — কোনো Lorem ipsum ছাড়া বাস্তব টেক্সট দিয়ে।
const heroSlides = [
  {
    title: "একটা ভালো আইডিয়া থেকে বাস্তব প্রজেক্ট",
    subtitle: "PledgeNest-এ ক্যাম্পেইন চালু করুন, সাপোর্টারদের কাছ থেকে ক্রেডিট সংগ্রহ করুন",
  },
  {
    title: "প্রতিটা ক্রেডিট কারো স্বপ্নে অবদান রাখে",
    subtitle: "৫০ ক্রেডিট দিয়ে শুরু করুন, পছন্দের ক্যাম্পেইনে সাপোর্ট দিন",
  },
  {
    title: "স্বচ্ছ, নিরাপদ, কমিউনিটি-চালিত",
    subtitle: "প্রতিটা ক্যাম্পেইন অ্যাডমিন-অনুমোদিত, প্রতিটা লেনদেন ট্র্যাকযোগ্য",
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
            ক্যাম্পেইন এক্সপ্লোর করুন
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-neutral-700 px-6 py-3 font-medium hover:border-emerald-400"
          >
            ক্রিয়েটর হিসেবে যোগ দিন
          </Link>
        </div>
        {/* 💡 Phase পরবর্তী ধাপে এখানে Swiper দিয়ে ৩টা স্লাইড এবং animation (framer-motion) যোগ হবে */}
      </section>

      {/* Top Funded Campaigns */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-8 text-2xl font-bold">সবচেয়ে বেশি ফান্ডেড ক্যাম্পেইন</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* 💡 এখানে backend থেকে top 6 campaigns fetch করে card রেন্ডার হবে (Phase 5/6) */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-neutral-500">
            ক্যাম্পেইন ডেটা এখনো যুক্ত হয়নি — Campaign API রেডি হলে এখানে দেখা যাবে
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-neutral-800 bg-neutral-900/40 px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-8 text-2xl font-bold">সাপোর্টাররা যা বলেন</h2>
          {/* 💡 Swiper Slider দিয়ে static testimonial যোগ হবে */}
          <p className="text-neutral-400">টেস্টিমোনিয়াল স্লাইডার শীঘ্রই যুক্ত হবে</p>
        </div>
      </section>

      {/* Extra Section 1: How It Works */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="mb-8 text-2xl font-bold">এটা কীভাবে কাজ করে</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-neutral-800 p-6">
            <span className="text-emerald-400">০১</span>
            <h3 className="mt-2 font-semibold">রেজিস্টার করুন</h3>
            <p className="mt-1 text-sm text-neutral-400">
              Supporter বা Creator হিসেবে অ্যাকাউন্ট খুলুন এবং ফ্রি ক্রেডিট পান
            </p>
          </div>
          <div className="rounded-xl border border-neutral-800 p-6">
            <span className="text-emerald-400">০২</span>
            <h3 className="mt-2 font-semibold">ক্যাম্পেইন খুঁজুন বা তৈরি করুন</h3>
            <p className="mt-1 text-sm text-neutral-400">
              পছন্দের প্রজেক্ট সাপোর্ট করুন, অথবা নিজের প্রজেক্টের জন্য ক্যাম্পেইন চালু করুন
            </p>
          </div>
          <div className="rounded-xl border border-neutral-800 p-6">
            <span className="text-emerald-400">০৩</span>
            <h3 className="mt-2 font-semibold">অগ্রগতি ট্র্যাক করুন</h3>
            <p className="mt-1 text-sm text-neutral-400">
              ড্যাশবোর্ড থেকে প্রতিটা কন্ট্রিবিউশন ও ক্যাম্পেইনের আপডেট দেখুন
            </p>
          </div>
        </div>
      </section>

      {/* Extra Section 2: Explore by Category */}
      <section className="border-t border-neutral-800 px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-2xl font-bold">ক্যাটাগরি অনুযায়ী এক্সপ্লোর করুন</h2>
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
        <h2 className="mb-8 text-2xl font-bold">প্ল্যাটফর্মের প্রভাব সংখ্যায়</h2>
        <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
          <div>
            <p className="text-3xl font-bold text-emerald-400">০</p>
            <p className="text-sm text-neutral-400">সক্রিয় ক্যাম্পেইন</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-emerald-400">০</p>
            <p className="text-sm text-neutral-400">মোট সাপোর্টার</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-emerald-400">০</p>
            <p className="text-sm text-neutral-400">সংগৃহীত ক্রেডিট</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-emerald-400">০</p>
            <p className="text-sm text-neutral-400">সফল প্রজেক্ট</p>
          </div>
        </div>
        {/* 💡 এই সংখ্যাগুলো পরে backend থেকে dynamic হবে */}
      </section>
    </div>
  );
}
