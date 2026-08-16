"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * পেজ পাল্টালে (client-side navigation) স্ক্রল পজিশন উপরে রিসেট করে —
 * নাহলে লম্বা পেজ থেকে ছোট পেজে গেলে ইউজার মাঝপথে আটকে থাকতে পারে।
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}