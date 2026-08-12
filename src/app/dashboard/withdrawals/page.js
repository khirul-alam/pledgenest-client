"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { getCreatorEarnings, requestWithdrawal } from "../../../services/withdrawalService";

const PAYMENT_SYSTEMS = ["Stripe", "Bkash", "Rocket", "Nagad"];

export default function WithdrawalsPage() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadEarnings = () => {
    if (!user?.email) return;
    setLoading(true);
    getCreatorEarnings(axiosSecure, user.email)
      .then(setEarnings)
      .catch((err) => console.error("Failed to load earnings:", err.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadEarnings, [user?.email]); // eslint-disable-line react-hooks/exhaustive-deps

  const withdrawAmountDollars = credits ? (Number(credits) / 20).toFixed(2) : "0.00";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const payment_system = form.payment_system.value;
    const account_number = form.account_number.value.trim();

    if (!account_number) {
      toast.error("Please enter your account number");
      return;
    }

    setSubmitting(true);
    try {
      await requestWithdrawal(axiosSecure, {
        withdrawal_credit: Number(credits),
        payment_system,
        account_number,
      });
      toast.success("Withdrawal request submitted");
      setCredits("");
      form.account_number.value = "";
      loadEarnings();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to submit withdrawal request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-neutral-500">Loading...</p>;
  }

  const canWithdraw = earnings?.canWithdraw;

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold">Withdrawals</h1>
      <p className="mt-1 text-sm text-neutral-400">
        20 credits = $1. Minimum withdrawal is {earnings?.minimumWithdrawCredits} credits ($10).
      </p>

      <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900 p-5">
        <p className="text-sm text-neutral-400">Available to withdraw</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-emerald-400">{earnings?.raisedCredits ?? 0}</span>
          <span className="text-sm text-neutral-400">credits</span>
        </div>
        <p className="mt-1 text-sm text-neutral-500">≈ ${earnings?.withdrawableAmount?.toFixed(2) ?? "0.00"}</p>
      </div>

      {!canWithdraw ? (
        <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900 p-5 text-center text-neutral-400">
          Insufficient credit — you need at least {earnings?.minimumWithdrawCredits} credits raised to withdraw.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm text-neutral-300">Credits To Withdraw</label>
            <input
              type="number"
              min={earnings.minimumWithdrawCredits}
              max={earnings.raisedCredits}
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              placeholder={`Min ${earnings.minimumWithdrawCredits}`}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-neutral-300">Withdraw Amount ($)</label>
            <input type="text" value={`$${withdrawAmountDollars}`} disabled className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2 text-neutral-500" />
          </div>

          <div>
            <label className="mb-1 block text-sm text-neutral-300">Select Payment System</label>
            <select name="payment_system" defaultValue="Stripe" className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 outline-none focus:border-emerald-400">
              {PAYMENT_SYSTEMS.map((sys) => (<option key={sys} value={sys}>{sys}</option>))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm text-neutral-300">Account Number</label>
            <input name="account_number" type="text" placeholder="Your payment account number" className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 outline-none focus:border-emerald-400" />
          </div>

          <button
            type="submit"
            disabled={submitting || !credits || Number(credits) < earnings.minimumWithdrawCredits || Number(credits) > earnings.raisedCredits}
            className="mt-2 rounded-full bg-emerald-500 px-6 py-3 font-medium text-neutral-950 hover:bg-emerald-400 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Withdraw"}
          </button>
        </form>
      )}
    </div>
  );
}