"use client";
import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

export default function useRole() {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [roleData, setRoleData] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user?.email) return;

    setRoleLoading(true);
    axiosSecure
      .get(`/users/role/${user.email}`)
      .then((res) => setRoleData(res.data))
      .catch((err) => console.error("Role fetch failed:", err.message))
      .finally(() => setRoleLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email, authLoading]);

  return {
    role: roleData?.role,
    credits: roleData?.credits,
    roleLoading: authLoading || roleLoading,
    refetchRole: () => {
      if (user?.email) {
        axiosSecure.get(`/users/role/${user.email}`).then((res) => setRoleData(res.data));
      }
    },
  };
}