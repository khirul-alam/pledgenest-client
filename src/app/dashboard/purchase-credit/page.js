"use client";
import { useState } from "react";
import useRole from "../../../hooks/useRole";
import CheckoutModal from "../../../components/dashboard/CheckoutModal";

const PACKAGES = [
  { credits: 100, price: 10 },
  { credits: 300, price: 25 },
  { credits: 800, price: 60 },
  { credits: 1500, price: 110 },
];

export default function PurchaseCreditPage() {
  const { refetchRole } = useRole();
  const [selectedPkg, setSelectedPkg] = useState(null);

  const handleSuccess = () => {
    setSelectedPkg(null);
    refetchRole();
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
            <button onClick={() => setSelectedPkg(pkg)} className="mt-6 w-full rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-neutral-950 hover:bg-emerald-400">
              Buy Now
            </button>
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs text-neutral-600">
        Payments are processed securely through Stripe. If Stripe isn&apos;t configured yet, the purchase completes in test mode automatically.
      </p>

      {selectedPkg && (
        <CheckoutModal pkg={selectedPkg} onSuccess={handleSuccess} onCancel={() => setSelectedPkg(null)} />
      )}
    </div>
  );
}