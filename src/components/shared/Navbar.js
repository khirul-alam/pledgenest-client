"use client";
import Link from "next/link";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

const GITHUB_CLIENT_REPO = "https://github.com/your-username/pledgenest-client";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("সফলভাবে লগআউট হয়েছে");
    } catch (error) {
      toast.error("লগআউট করা যায়নি");
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-white">
          Pledge<span className="text-emerald-400">Nest</span>
        </Link>

        {/* ডেস্কটপ মেনু */}
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/explore-campaigns" className="text-sm text-neutral-300 hover:text-white">
            ক্যাম্পেইন এক্সপ্লোর করুন
          </Link>

          {!user ? (
            <>
              <Link href="/login" className="text-sm text-neutral-300 hover:text-white">
                লগইন
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-emerald-400"
              >
                রেজিস্টার
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="text-sm text-neutral-300 hover:text-white">
                ড্যাশবোর্ড
              </Link>
              <img
                src={user.photoURL || "https://i.ibb.co/2d1yv0J/default-avatar.png"}
                alt={user.displayName || "user"}
                title={user.displayName || ""}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-emerald-400"
              />
              <button
                onClick={handleLogout}
                className="rounded-full border border-neutral-700 px-4 py-2 text-sm text-neutral-300 hover:border-red-400 hover:text-red-400"
              >
                লগআউট
              </button>
            </>
          )}

          <a
            href={GITHUB_CLIENT_REPO}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-neutral-400 hover:text-white"
          >
            Join as Developer
          </a>
        </div>

        {/* মোবাইল মেনু টগল */}
        <button
          className="text-white md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="মেনু খুলুন"
        >
          ☰
        </button>
      </div>

      {/* মোবাইল মেনু */}
      {menuOpen && (
        <div className="flex flex-col gap-3 border-t border-neutral-800 bg-neutral-950 px-4 py-4 md:hidden">
          <Link href="/explore-campaigns" onClick={() => setMenuOpen(false)}>
            ক্যাম্পেইন এক্সপ্লোর করুন
          </Link>
          {!user ? (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)}>লগইন</Link>
              <Link href="/register" onClick={() => setMenuOpen(false)}>রেজিস্টার</Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)}>ড্যাশবোর্ড</Link>
              <button onClick={handleLogout} className="text-left text-red-400">
                লগআউট
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
