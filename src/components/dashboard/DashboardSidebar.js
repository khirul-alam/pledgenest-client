"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_BY_ROLE = {
  supporter: [
    { label: "Home", href: "/dashboard/supporter-home" },
    { label: "Explore Campaigns", href: "/explore-campaigns" },
    { label: "My Contributions", href: "/dashboard/my-contributions" },
    { label: "Purchase Credit", href: "/dashboard/purchase-credit" },
    { label: "Payment History", href: "/dashboard/payment-history" },
  ],
  creator: [
    { label: "Home", href: "/dashboard/creator-home" },
    { label: "Add New Campaign", href: "/dashboard/add-campaign" },
    { label: "My Campaigns", href: "/dashboard/my-campaigns" },
    { label: "Withdrawals", href: "/dashboard/withdrawals" },
    { label: "Payment History", href: "/dashboard/payment-history" },
  ],
  admin: [
    { label: "Home", href: "/dashboard/admin-home" },
    { label: "Manage Users", href: "/dashboard/manage-users" },
    { label: "Manage Campaigns", href: "/dashboard/manage-campaigns" },
    { label: "Withdrawal Requests", href: "/dashboard/withdrawal-requests" },
    { label: "Reports", href: "/dashboard/reports" },
  ],
};

export default function DashboardSidebar({ role }) {
  const pathname = usePathname();
  const links = NAV_BY_ROLE[role] || [];

  return (
    <aside className="w-full shrink-0 border-b border-neutral-800 bg-neutral-900/40 md:w-60 md:border-b-0 md:border-r md:min-h-[calc(100vh-64px)]">
      <nav className="flex flex-row gap-1 overflow-x-auto p-3 md:flex-col md:overflow-visible">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm transition ${
                active ? "bg-emerald-500 text-neutral-950 font-medium" : "text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}