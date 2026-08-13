import { loadStripe } from "@stripe/stripe-js";

let stripePromise;

export default function getStripe() {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    stripePromise = key ? loadStripe(key) : null;
  }
  return stripePromise;
}