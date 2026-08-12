"use client";
import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useRole from "../../../hooks/useRole";
import { getSupporterPaymentHistory, getCreatorPaymentHistory } from "../../../services/paymentService";

export default function PaymentHistoryPage() {
  const { user } = useAuth();
  const { role, roleLoading } = useRole();
  const axiosSecure = useAxiosSecure();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email || roleLoading || !role) return;

    setLoading(true);
    const fetcher = role === "creator"
      ? getCreatorPaymentHistory(axiosSecure, user.email)
      : getSupporterPaymentHistory(axiosSecure, user.email);

    fetcher
      .then(setPayments)
      .catch((err) => console.error("Failed to load payment history:", err.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email, role, roleLoading]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Payment History</h1>
      <p className="mt-1 text-sm text-neutral-400">
        {role === "creator" ? "All your withdrawal requests and their status." : "All your credit purchases."}
      </p>

      <div className="mt-6">
        {loading ? (
          <p className="text-neutral-500">Loading...</p>
        ) : payments.length === 0 ? (
          <p className="text-neutral-500">No payment records yet.</p>
        ) : role === "creator" ? (
          <div className="overflow-x-auto rounded-xl border border-neutral-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-900 text-neutral-400">
                <tr>
                  <th className="px-4 py-3">Credits</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Payment System</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {payments.map((p) => (
                  <tr key={p._id}>
                    <td className="px-4 py-3">{p.withdrawal_credit} credits</td>
                    <td className="px-4 py-3">${p.withdrawal_amount}</td>
                    <td className="px-4 py-3 capitalize">{p.payment_system}</td>
                    <td className="px-4 py-3 text-neutral-400">{new Date(p.withdraw_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${p.status === "approved" ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-400"}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-900 text-neutral-400">
                <tr>
                  <th className="px-4 py-3">Credits Purchased</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Transaction ID</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {payments.map((p) => (
                  <tr key={p._id}>
                    <td className="px-4 py-3">{p.credits} credits</td>
                    <td className="px-4 py-3">${p.price}</td>
                    <td className="px-4 py-3 text-neutral-500">{p.transactionId}</td>
                    <td className="px-4 py-3 text-neutral-400">{new Date(p.paymentDate).toLocaleDateString()}</td>
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