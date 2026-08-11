"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuth from "../../hooks/useAuth";

/**
 * PrivateRoute
 * ------------
 * ড্যাশবোর্ডের যেকোনো প্রাইভেট পেজকে এই কম্পোনেন্ট দিয়ে wrap করুন।
 *
 * মূল বাগ ফিক্স: আগে অনেকে `if (!user) router.push('/login')` সরাসরি লিখে ফেলেন,
 * যেটা reload এর প্রথম মুহূর্তে (Firebase auth state restore হওয়ার আগেই)
 * `user` কে null দেখায় এবং ভুলভাবে login পেজে পাঠিয়ে দেয়।
 *
 * এখানে `loading` state আগে চেক করা হচ্ছে — যতক্ষণ Firebase session restore
 * করছে, ততক্ষণ শুধু spinner দেখানো হবে, redirect না করে।
 */
export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!user) {
    return null; // redirect useEffect এ হচ্ছে, এখানে কিছু রেন্ডার করার দরকার নেই
  }

  return children;
}
