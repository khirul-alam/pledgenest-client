"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { getPendingWithdrawalsAdmin, approveWithdrawal } from "../../../services/withdrawalService";

export default function WithdrawalRequestsPage() {
  const axiosSecure = useAxiosSecure();

  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);

  const loadWithdrawals = () => {
    setLoading(true);
    getPendingWithdrawalsAdmin(axiosSecure)
      .then(setWithdrawals)
      .catch((err) => console.error("Failed to load withdrawals:", err.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadWithdrawals, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApprove = async (id) => {
    setActioningId(id);
    try {
      await approveWithdrawal(axiosSecure, id);
      toast.success("Payment marked as successful");
      loadWithdrawals();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to approve withdrawal");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Withdrawal Requests</h1>
      <p className="mt-1 text-sm text-neutral-400">Pending withdrawal requests from creators.</p>

      <div className="mt-6">
        {loading ? (
          <p className="text-neutral-500">Loading...</p>
        ) : withdrawals.length === 0 ? (
          <p className="text-neutral-500">No pending withdrawal requests.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-900 text-neutral-400">
                <tr>
                  <th className="px-4 py-3">Creator</th>
                  <th className="px-4 py-3">Credits</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Payment System</th>
                  <th className="px-4 py-3">Account</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {withdrawals.map((w) => (
                  <tr key={w._id}>
                    <td className="px-4 py-3">{w.creator_name}</td>
                    <td className="px-4 py-3">{w.withdrawal_credit} credits</td>
                    <td className="px-4 py-3">${w.withdrawal_amount}</td>
                    <td className="px-4 py-3 capitalize">{w.payment_system}</td>
                    <td className="px-4 py-3 text-neutral-400">{w.account_number}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleApprove(w._id)}
                        disabled={actioningId === w._id}
                        className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-neutral-950 hover:bg-emerald-400 disabled:opacity-50"
                      >
                        Payment Success
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}