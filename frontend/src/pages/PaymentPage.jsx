import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import {
  getPublicInvoice,
  createPaymentOrder,
  verifyPayment,
} from "../lib/publicPayment";

export default function PaymentPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const signature = searchParams.get("signature");

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState(null);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    getPublicInvoice(id, signature)
      .then((data) => {
        setInvoice(data);
        setPaid(data.status === "paid");
      })
      .catch(() => setError("This payment link is invalid or has expired."))
      .finally(() => setLoading(false));
  }, [id, signature]);

  async function handlePay() {
    setPaying(true);
    setError(null);
    try {
      const order = await createPaymentOrder(id);

      const razorpay = new window.Razorpay({
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: "Invoice Payment",
        description: invoice.invoice_number,
        handler: async function (response) {
          try {
            await verifyPayment(id, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            setPaid(true);
          } catch {
            setError(
              "Payment succeeded but verification failed. Please contact the freelancer.",
            );
          }
        },
        modal: {
          ondismiss: function () {
            setPaying(false);
          },
        },
      });

      razorpay.open();
    } catch (err) {
      console.error("Payment order error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message ||
          "Failed to start payment. Please try again.",
      );
      setPaying(false);
    }
  }

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-navy/60">
        Loading…
      </div>
    );
  if (error && !invoice)
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-status-overdue">
        {error}
      </div>
    );

  if (paid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-4">
        <div className="w-full max-w-sm rounded-lg border border-seafoam/40 bg-white p-8 text-center">
          <CheckCircle2 className="mx-auto text-status-paid" size={48} />
          <h1 className="mt-4 text-xl font-semibold text-navy">
            Payment received
          </h1>
          <p className="mt-2 text-sm text-navy/60">
            Thank you — invoice {invoice.invoice_number} has been marked as
            paid.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm rounded-lg border border-seafoam/40 bg-white p-8">
        <h1 className="text-xl font-semibold text-navy">
          {invoice.invoice_number}
        </h1>
        <p className="mt-1 text-sm text-navy/60">
          Billed to {invoice.client_name}
        </p>

        <div className="mt-6 divide-y divide-seafoam/20 border-y border-seafoam/30">
          {invoice.line_items.map((item) => (
            <div key={item.id} className="flex justify-between py-2 text-sm">
              <span className="text-navy/70">{item.description}</span>
              <span className="tabular-nums text-navy">${item.subtotal}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-medium text-navy/60">Total due</span>
          <span className="text-2xl font-semibold tabular-nums text-navy">
            ${invoice.total}
          </span>
        </div>

        <button
          onClick={handlePay}
          disabled={paying}
          className="mt-6 w-full rounded-md bg-teal px-4 py-3 text-sm font-medium text-white hover:bg-teal-light disabled:opacity-60"
        >
          {paying ? "Processing…" : "Pay now"}
        </button>

        {error && <p className="mt-3 text-sm text-status-overdue">{error}</p>}
      </div>
    </div>
  );
}
