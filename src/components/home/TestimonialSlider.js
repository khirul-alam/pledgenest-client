"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const TESTIMONIALS = [
  {
    name: "Nusrat Jahan",
    role: "Backed 6 campaigns",
    initials: "NJ",
    color: "bg-emerald-500",
    quote: "I started with the 50 free credits just to see how it worked, and ended up contributing to a solar water pump project in my hometown. Watching the raised amount go up each week kept me coming back.",
  },
  {
    name: "Tanvir Ahmed",
    role: "Creator — Community Library Project",
    initials: "TA",
    color: "bg-sky-500",
    quote: "The approval step made me trust the platform more, not less. Supporters could see my campaign was vetted, and the notification the moment someone contributed kept the momentum going.",
  },
  {
    name: "Farhana Islam",
    role: "Creator — Handmade Pottery Collective",
    initials: "FI",
    color: "bg-amber-500",
    quote: "Withdrawing what I raised was straightforward — I could see exactly how many credits converted to dollars before I even submitted the request. No surprises.",
  },
];

export default function TestimonialSlider() {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      slidesPerView={1}
      spaceBetween={24}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      loop
      breakpoints={{ 768: { slidesPerView: 2 } }}
      className="testimonial-swiper pb-10"
    >
      {TESTIMONIALS.map((t) => (
        <SwiperSlide key={t.name}>
          <figure className="flex h-full flex-col rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-left">
            <blockquote className="flex-1 text-sm text-neutral-300">&ldquo;{t.quote}&rdquo;</blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-neutral-950 ${t.color}`}>
                {t.initials}
              </span>
              <div>
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-neutral-500">{t.role}</p>
              </div>
            </figcaption>
          </figure>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}