import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Trash2, Plus } from "lucide-react";
import {
  getInvoice,
  updateInvoice,
  deleteInvoice,
  getPaymentLink,
} from "../lib/invoices";
import { createLineItem, deleteLineItem } from "../lib/lineItems";
import StatusBadge from "../components/StatusBadge";

const inputClass =
  "rounded-md border border-seafoam/60 px-3 py-2 text-sm text-navy outline-none focus:border-teal";
const labelClass = "text-xs font-medium text-navy/60";

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unitPrice, setUnitPrice] = useState("");
  const [status, setStatus] = useState("draft");

  useEffect(() => {
    loadInvoice();
  }, [id]);

  async function loadInvoice() {
    setLoading(true);
    try {
      const data = await getInvoice(id);
      setInvoice(data);
      setStatus(data.status);
    } catch {
      setError("Invoice not found");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(e) {
    const newStatus = e.target.value;
    setStatus(newStatus);
    try {
      await updateInvoice(id, { status: newStatus });
      loadInvoice();
    } catch {
      setError("Failed to update status");
    }
  }

  async function handleCopyLink() {
    const backendUrl = await getPaymentLink(id);
    // Convert the backend link into a frontend link the client can actually open
    const url = new URL(backendUrl);
    const frontendUrl = `http://localhost:5173/pay/${id}?signature=${url.searchParams.get(
      "signature",
    )}`;
    navigator.clipboard.writeText(frontendUrl);
    alert("Payment link copied to clipboard");
  }

  async function handleDelete() {
    if (!confirm("Delete this invoice and all its line items?")) return;
    await deleteInvoice(id);
    navigate(`/projects/${invoice.project_id}`);
  }

  async function handleAddLineItem(e) {
    e.preventDefault();
    setError(null);
    try {
      await createLineItem(id, {
        description,
        quantity: parseFloat(quantity),
        unit_price: parseFloat(unitPrice),
      });
      setDescription("");
      setQuantity("1");
      setUnitPrice("");
      loadInvoice();
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(
        errors
          ? Object.values(errors).flat().join(", ")
          : "Failed to add line item",
      );
    }
  }

  async function handleDeleteLineItem(lineItemId) {
    await deleteLineItem(lineItemId);
    loadInvoice();
  }

  if (loading) return <p className="text-sm text-navy/60">Loading…</p>;
  if (error && !invoice)
    return <p className="text-sm text-status-overdue">{error}</p>;

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to={`/projects/${invoice.project_id}`}
        className="flex items-center gap-1 text-sm text-navy/60 hover:text-teal"
      >
        <ArrowLeft size={14} /> Back to project
      </Link>

      <div className="mt-4 flex items-start justify-between rounded-lg border border-seafoam/40 bg-white p-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-navy">
              {invoice.invoice_number}
            </h1>
            <StatusBadge status={status} />
          </div>
          <p className="mt-2 text-sm text-navy/60">
            Issued {invoice.issue_date?.slice(0, 10)} &middot; Due{" "}
            {invoice.due_date?.slice(0, 10)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={handleStatusChange}
            className={inputClass}
          >
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
          <button
            onClick={handleCopyLink}
            className="rounded-md bg-teal px-3 py-2 text-sm font-medium text-white hover:bg-teal-light"
          >
            Copy payment link
          </button>
          <button
            onClick={handleDelete}
            className="rounded-md p-2 text-navy/50 hover:bg-cream hover:text-status-overdue"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg bg-navy px-6 py-4">
        <span className="text-sm font-medium text-seafoam">Total</span>
        <span className="text-2xl font-semibold tabular-nums text-cream">
          ${invoice.total}
        </span>
      </div>

      {error && <p className="mt-3 text-sm text-status-overdue">{error}</p>}

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-navy">Line items</h2>
        <a
          href={`http://localhost:8080/api/invoices/${id}/pdf`}
          target="_blank"
          rel="noopener"
          className="rounded-md bg-navy px-3 py-2 text-sm font-medium text-cream hover:bg-navy-light"
        >
          Download PDF
        </a>
      </div>
      <div className="mt-3 overflow-hidden rounded-lg border border-seafoam/40 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-seafoam/30 text-left text-xs font-medium text-navy/50">
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2 text-right">Qty</th>
              <th className="px-4 py-2 text-right">Unit price</th>
              <th className="px-4 py-2 text-right">Subtotal</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-seafoam/20">
            {invoice.line_items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-2 text-navy">{item.description}</td>
                <td className="px-4 py-2 text-right tabular-nums text-navy/70">
                  {item.quantity}
                </td>
                <td className="px-4 py-2 text-right tabular-nums text-navy/70">
                  ${item.unit_price}
                </td>
                <td className="px-4 py-2 text-right tabular-nums font-medium text-navy">
                  ${item.subtotal}
                </td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => handleDeleteLineItem(item.id)}
                    className="text-navy/40 hover:text-status-overdue"
                    title="Remove"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form
        onSubmit={handleAddLineItem}
        className="mt-4 flex flex-wrap items-end gap-3 rounded-lg border border-seafoam/40 bg-white p-4"
      >
        <div className="flex flex-1 flex-col gap-1">
          <label className={labelClass}>Description</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Qty</label>
          <input
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            type="number"
            step="0.01"
            required
            className={`${inputClass} w-20`}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Unit price</label>
          <input
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            type="number"
            step="0.01"
            required
            className={`${inputClass} w-28`}
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 rounded-md bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-teal-light"
        >
          <Plus size={16} />
          Add
        </button>
      </form>
    </div>
  );
}
