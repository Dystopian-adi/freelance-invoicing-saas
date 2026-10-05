import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { getProject, updateProject, deleteProject } from "../lib/projects";
import { createInvoice } from "../lib/invoices";
import StatusBadge from "../components/StatusBadge";

const inputClass =
  "rounded-md border border-seafoam/60 px-3 py-2 text-sm text-navy outline-none focus:border-teal";
const labelClass = "text-xs font-medium text-navy/60";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [rateType, setRateType] = useState("fixed");
  const [rate, setRate] = useState("");

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    loadProject();
  }, [id]);

  async function loadProject() {
    setLoading(true);
    try {
      const data = await getProject(id);
      setProject(data);
      setName(data.name);
      setDescription(data.description ?? "");
      setStatus(data.status);
      setRateType(data.rate_type);
      setRate(data.rate ?? "");
    } catch {
      setError("Project not found");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      await updateProject(id, {
        name,
        description,
        status,
        rate_type: rateType,
        rate: rate ? parseFloat(rate) : null,
      });
      setEditing(false);
      loadProject();
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(
        errors
          ? Object.values(errors).flat().join(", ")
          : "Failed to update project",
      );
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this project and all its invoices?")) return;
    await deleteProject(id);
    navigate(`/clients/${project.client_id}`);
  }

  async function handleCreateInvoice(e) {
    e.preventDefault();
    setError(null);
    try {
      await createInvoice(id, {
        invoice_number: invoiceNumber,
        status: "draft",
        issue_date: issueDate,
        due_date: dueDate,
      });
      setInvoiceNumber("");
      setIssueDate("");
      setDueDate("");
      loadProject();
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(
        errors
          ? Object.values(errors).flat().join(", ")
          : "Failed to create invoice",
      );
    }
  }

  if (loading) return <p className="text-sm text-navy/60">Loading…</p>;
  if (error && !project)
    return <p className="text-sm text-status-overdue">{error}</p>;

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to={`/clients/${project.client_id}`}
        className="flex items-center gap-1 text-sm text-navy/60 hover:text-teal"
      >
        <ArrowLeft size={14} /> Back to client
      </Link>

      <div className="mt-4 rounded-lg border border-seafoam/40 bg-white p-6">
        {editing ? (
          <form onSubmit={handleUpdate} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Project name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={inputClass}
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={inputClass}
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Rate type</label>
                <select
                  value={rateType}
                  onChange={(e) => setRateType(e.target.value)}
                  className={inputClass}
                >
                  <option value="fixed">Fixed</option>
                  <option value="hourly">Hourly</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className={labelClass}>Rate</label>
                <input
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  type="number"
                  step="0.01"
                  className={`${inputClass} w-28`}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-md bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-teal-light"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-md px-4 py-2 text-sm font-medium text-navy/60 hover:bg-cream"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold text-navy">
                  {project.name}
                </h1>
                <StatusBadge status={project.status} />
              </div>
              {project.description && (
                <p className="mt-2 text-sm text-navy/60">
                  {project.description}
                </p>
              )}
              <p className="mt-1 text-sm text-navy/50">
                {project.rate_type === "hourly"
                  ? `$${project.rate}/hr`
                  : `$${project.rate} fixed`}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(true)}
                className="rounded-md p-2 text-navy/50 hover:bg-cream hover:text-teal"
                title="Edit"
              >
                <Pencil size={16} />
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
        )}
      </div>

      {error && <p className="mt-3 text-sm text-status-overdue">{error}</p>}

      <h2 className="mt-8 text-lg font-semibold text-navy">Invoices</h2>
      <div className="mt-3 divide-y divide-seafoam/30 rounded-lg border border-seafoam/40 bg-white">
        {project.invoices.length === 0 ? (
          <p className="p-6 text-sm text-navy/60">No invoices yet.</p>
        ) : (
          project.invoices.map((invoice) => (
            <Link
              key={invoice.id}
              to={`/invoices/${invoice.id}`}
              className="flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-cream"
            >
              <span className="font-medium text-navy">
                {invoice.invoice_number}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-navy/60">${invoice.total}</span>
                <StatusBadge status={invoice.status} />
              </div>
            </Link>
          ))
        )}
      </div>

      <form
        onSubmit={handleCreateInvoice}
        className="mt-4 flex flex-wrap items-end gap-3 rounded-lg border border-seafoam/40 bg-white p-4"
      >
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Invoice number</label>
          <input
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            placeholder="INV-001"
            required
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Issue date</label>
          <input
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
            type="date"
            required
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Due date</label>
          <input
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            type="date"
            required
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 rounded-md bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-teal-light"
        >
          <Plus size={16} />
          Add invoice
        </button>
      </form>
    </div>
  );
}
