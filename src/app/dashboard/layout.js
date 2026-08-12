"use client";
import Link from "next/link";
import PrivateRoute from "../../components/shared/PrivateRoute";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import NotificationBell from "../../components/dashboard/NotificationBell";
import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";

function DashboardContent({ children }) {
  const { user } = useAuth();
  const { role, credits, roleLoading } = useRole();

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
        <div className="flex items-center justify-between gap-4 border-b border-neutral-800 bg-neutral-900/40 px-4 py-3 md:px-6">
          <Link href="/" className="text-lg font-bold">
            Pledge<span className="text-emerald-400">Nest</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium capitalize">{user?.displayName}</p>
              <p className="text-xs capitalize text-neutral-400">{role}</p>
            </div>

            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
              {credits ?? 0} Credits
            </span>

            <NotificationBell />

            <img
              src={user?.photoURL || "https://i.ibb.co/2d1yv0J/default-avatar.png"}
              alt={user?.displayName || "user"}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-emerald-400"
            />
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