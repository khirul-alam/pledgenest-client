"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useRole from "../../../hooks/useRole";
import { purchaseCredits } from "../../../services/paymentService";

const PACKAGES = [
  { credits: 100, price: 10 },
  { credits: 300, price: 25 },
  { credits: 800, price: 60 },
  { credits: 1500, price: 110 },
];

export default function PurchaseCreditPage() {
  const axiosSecure = useAxiosSecure();
  const { refetchRole } = useRole();
  const [processingPkg, setProcessingPkg] = useState(null);

  const handlePurchase = async (pkg) => {
    setProcessingPkg(pkg.credits);
    try {
      await purchaseCredits(axiosSecure, { credits: pkg.credits, price: pkg.price });
      toast.success(`${pkg.credits} credits added to your account! 🎉`);
      refetchRole();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Payment failed");
    } finally {
      setProcessingPkg(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Purchase Credit</h1>
      <p className="mt-1 text-sm text-neutral-400">Buy credits to support the campaigns you care about.</p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PACKAGES.map((pkg) => (
          <div key={pkg.credits} className="flex flex-col items-center rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-center transition hover:border-emerald-500/50">
            <p className="text-3xl font-bold text-emerald-400">{pkg.credits}</p>
            <p className="text-sm text-neutral-400">credits</p>
            <p className="mt-4 text-xl font-semibold">${pkg.price}</p>
            <button
              onClick={() => handlePurchase(pkg)}
              disabled={processingPkg !== null}
              className="mt-6 w-full rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-emerald-400 disabled:opacity-50"
            >
              {processingPkg === pkg.credits ? "Processing..." : "Buy Now"}
            </button>
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs text-neutral-600">
        Payments are currently processed in test mode. Card checkout will be enabled once Stripe is fully configured.
      </p>
    </div>
  );
}