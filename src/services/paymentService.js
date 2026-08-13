export async function purchaseCredits(axiosSecure, { credits, price }) {
  const res = await axiosSecure.post("/payments", { credits, price, payment_system: "stripe" });
  return res.data;
}

export async function createPaymentIntent(axiosSecure, credits) {
  const res = await axiosSecure.post("/create-payment-intent", { credits });
  return res.data;
}

export async function savePayment(axiosSecure, { credits, price, transactionId }) {
  const res = await axiosSecure.post("/payments", {
    credits,
    price,
    transactionId,
    payment_system: "stripe",
  });
  return res.data;
}

export async function getSupporterPaymentHistory(axiosSecure, email) {
  const res = await axiosSecure.get(`/payments/supporter/${email}`);
  return res.data;
}

export async function getCreatorPaymentHistory(axiosSecure, email) {
  const res = await axiosSecure.get(`/withdrawals/creator/${email}`);
  return res.data;
}