"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useRole from "../../hooks/useRole";

const HOME_BY_ROLE = {
  supporter: "/dashboard/supporter-home",
  creator: "/dashboard/creator-home",
  admin: "/dashboard/admin-home",
};

export default function DashboardIndexPage() {
  const { role, roleLoading } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (!roleLoading && role) {
      router.replace(HOME_BY_ROLE[role] || "/");
    }
  }, [role, roleLoading, router]);

  return (
    <div className="flex h-[50vh] items-center justify-center text-neutral-400">
      Redirecting to your dashboard...
    </div>
  );
}