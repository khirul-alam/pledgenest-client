"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import PrivateRoute from "../../components/shared/PrivateRoute";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import NotificationBell from "../../components/dashboard/NotificationBell";
import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";

function DashboardContent({ children }) {
  const { user, logoutUser } = useAuth();
  const { role, credits, roleLoading } = useRole();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  if (roleLoading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <span className="text-neutral-400">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row">
      <DashboardSidebar role={role} />

      <div className="flex-1">
        <div className="flex items-center justify-between gap-2 border-b border-neutral-800 bg-neutral-900/40 px-3 py-3 sm:gap-4 sm:px-4 md:px-6">
          <Link href="/" className="shrink-0 text-base font-bold sm:text-lg">
            Pledge<span className="text-emerald-400">Nest</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium capitalize">{user?.displayName}</p>
              <p className="text-xs capitalize text-neutral-400">{role}</p>
            </div>

            <span className="whitespace-nowrap rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400 sm:px-3">
              {credits ?? 0} Credits
            </span>

            <NotificationBell />

            <div className="relative" ref={menuRef}>
              <button onClick={() => setMenuOpen((prev) => !prev)} aria-label="Account menu">
                <img
                  src={user?.photoURL || "https://i.ibb.co/2d1yv0J/default-avatar.png"}
                  alt={user?.displayName || "user"}
                  className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-emerald-400 sm:h-9 sm:w-9"
                />
              </button>

              {menuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-neutral-800 bg-neutral-900 shadow-xl">
                  <div className="border-b border-neutral-800 px-4 py-3 sm:hidden">
                    <p className="truncate text-sm font-medium">{user?.displayName}</p>
                    <p className="text-xs capitalize text-neutral-400">{role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-neutral-800"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <PrivateRoute>
      <DashboardContent>{children}</DashboardContent>
    </PrivateRoute>
  );
}