"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const SLIDES = [
  {
    eyebrow: "Technology",
    title: "From a good idea to a real project",
    subtitle: "Launch your campaign on PledgeNest and raise credits from supporters who believe in what you're building.",
    gradient: "from-emerald-950 via-neutral-950 to-neutral-950",
  },
  {
    eyebrow: "Community",
    title: "Every credit contributes to someone's dream",
    subtitle: "Start with 50 free credits and back the campaigns that speak to you — a village water pump, a local art fund, a first-time founder.",
    gradient: "from-sky-950 via-neutral-950 to-neutral-950",
  },
  {
    eyebrow: "Environment",
    title: "Transparent, secure, community-driven",
    subtitle: "Every campaign is admin-approved before it goes live, and every credit you contribute is tracked from pledge to payout.",
    gradient: "from-amber-950 via-neutral-950 to-neutral-950",
  },
];

export default function HeroSlider() {
  return (
    <Swiper
      modules={[Autoplay, EffectFade, Pagination]}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      autoplay={{ delay: 6000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      loop
      className="hero-swiper"
    >
      {SLIDES.map((slide) => (
        <SwiperSlide key={slide.title}>
          <section className={`bg-gradient-to-b ${slide.gradient} border-b border-neutral-800 px-4 py-24 text-center`}>
            <span className="hero-fade-in inline-block text-xs font-medium uppercase tracking-[0.2em] text-emerald-400">
              {slide.eyebrow}
            </span>
            <h1 className="hero-fade-in mx-auto mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-5xl" style={{ animationDelay: "80ms" }}>
              {slide.title}
            </h1>
            <p className="hero-fade-in mx-auto mt-4 max-w-xl text-neutral-400" style={{ animationDelay: "160ms" }}>
              {slide.subtitle}
            </p>
            <div className="hero-fade-in mt-8 flex justify-center gap-4" style={{ animationDelay: "240ms" }}>
              <Link href="/explore-campaigns" className="rounded-full bg-emerald-500 px-6 py-3 font-medium text-neutral-950 transition hover:bg-emerald-400">
                Explore Campaigns
              </Link>
              <Link href="/register" className="rounded-full border border-neutral-700 px-6 py-3 font-medium transition hover:border-emerald-400">
                Join as a Creator
              </Link>
            </div>
          </section>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}