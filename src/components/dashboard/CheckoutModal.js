"use client";
import { useState } from "react";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import getStripe from "../../services/stripeLoader";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { createPaymentIntent, savePayment } from "../../services/paymentService";

const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#e5e5e5",
      "::placeholder": { color: "#737373" },
    },
    invalid: { color: "#f87171" },
  },
};

function CheckoutFormInner({ pkg, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setCardError("");

    try {
      const { clientSecret } = await createPaymentIntent(axiosSecure, pkg.credits);

      if (clientSecret.startsWith("dummy_")) {
        await savePayment(axiosSecure, {
          credits: pkg.credits,
          price: pkg.price,
          transactionId: `dummy_txn_${Date.now()}`,
        });
        toast.success(`${pkg.credits} credits added (test mode — Stripe key not configured)`);
        onSuccess();
        return;
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: user?.displayName, email: user?.email },
        },
      });

      if (error) {
        setCardError(error.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        await savePayment(axiosSecure, {
          credits: pkg.credits,
          price: pkg.price,
          transactionId: paymentIntent.id,
        });
        toast.success(`${pkg.credits} credits added to your account! 🎉`);
        onSuccess();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3">
        <CardElement options={cardElementOptions} />
      </div>
      {cardError && <p className="text-sm text-red-400">{cardError}</p>}
      <p className="text-xs text-neutral-500">
        Test card: 4242 4242 4242 4242, any future date, any CVC.
      </p>

      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className="flex-1 rounded-full border border-neutral-700 px-4 py-2.5 text-sm hover:border-neutral-500">
          Cancel
        </button>
        <button type="submit" disabled={!stripe || processing} className="flex-1 rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-medium text-neutral-950 hover:bg-emerald-400 disabled:opacity-50">
          {processing ? "Processing..." : `Pay $${pkg.price}`}
        </button>
      </div>
    </form>
  );
}

export default function CheckoutModal({ pkg, onSuccess, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <h3 className="text-lg font-semibold">{pkg.credits} credits — ${pkg.price}</h3>
        <p className="mt-1 text-sm text-neutral-400">Enter your card details to complete the purchase.</p>

        <div className="mt-5">
          <Elements stripe={getStripe()}>
            <CheckoutFormInner pkg={pkg} onSuccess={onSuccess} onCancel={onCancel} />
          </Elements>
        </div>
      </div>
    </div>
  );
}