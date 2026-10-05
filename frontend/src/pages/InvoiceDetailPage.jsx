import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getInvoice, updateInvoice, deleteInvoice } from "../lib/invoices";
import { createLineItem, deleteLineItem } from "../lib/lineItems";

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
    let ignore = false;

    const fetchInvoice = async () => {
      setLoading(true);
      try {
        const data = await getInvoice(id);
        if (ignore) return;

        setInvoice(data);
        setStatus(data.status);
      } catch {
        if (!ignore) setError("Invoice not found");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchInvoice();

    return () => {
      ignore = true;
    };
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

  if (loading) return <p>Loading...</p>;
  if (error && !invoice) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <Link to={`/projects/${invoice.project_id}`}>&larr; Back to project</Link>
      <h1>{invoice.invoice_number}</h1>

      <label>
        Status:{" "}
        <select value={status} onChange={handleStatusChange}>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </label>
      <button onClick={handleDelete}>Delete invoice</button>

      <p>Issue date: {invoice.issue_date?.slice(0, 10)}</p>
      <p>Due date: {invoice.due_date?.slice(0, 10)}</p>
      <h2>Total: ${invoice.total}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h3>Line Items</h3>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {invoice.line_items.map((item) => (
            <tr key={item.id}>
              <td>{item.description}</td>
              <td>{item.quantity}</td>
              <td>${item.unit_price}</td>
              <td>${item.subtotal}</td>
              <td>
                <button onClick={() => handleDeleteLineItem(item.id)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={handleAddLineItem} style={{ marginTop: "1rem" }}>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <input
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          type="number"
          step="0.01"
          placeholder="Qty"
          required
        />
        <input
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
          type="number"
          step="0.01"
          placeholder="Unit price"
          required
        />
        <button type="submit">Add line item</button>
      </form>
    </div>
  );
}
