import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProject, updateProject, deleteProject } from "../lib/projects";
import { createInvoice } from "../lib/invoices";

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
    let ignore = false;

    const fetchProject = async () => {
      setLoading(true);
      try {
        const data = await getProject(id);
        if (ignore) return;

        setProject(data);
        setName(data.name);
        setDescription(data.description ?? "");
        setStatus(data.status);
        setRateType(data.rate_type);
        setRate(data.rate ?? "");
      } catch {
        if (!ignore) setError("Project not found");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchProject();

    return () => {
      ignore = true;
    };
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

  if (loading) return <p>Loading...</p>;
  if (error && !project) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <Link to={`/clients/${project.client_id}`}>&larr; Back to client</Link>

      {editing ? (
        <form onSubmit={handleUpdate}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project name"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
          <select
            value={rateType}
            onChange={(e) => setRateType(e.target.value)}
          >
            <option value="fixed">Fixed</option>
            <option value="hourly">Hourly</option>
          </select>
          <input
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            type="number"
            step="0.01"
            placeholder="Rate"
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <h1>{project.name}</h1>
          <p>{project.description}</p>
          <p>Status: {project.status}</p>
          <p>
            Rate: {project.rate_type} — {project.rate}
          </p>
          <button onClick={() => setEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete project</button>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Invoices</h2>
      {project.invoices.length === 0 ? (
        <p>No invoices yet.</p>
      ) : (
        <ul>
          {project.invoices.map((invoice) => (
            <li key={invoice.id}>
              <Link to={`/invoices/${invoice.id}`}>
                {invoice.invoice_number} — {invoice.status} — ${invoice.total}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <h3>Add an invoice</h3>
      <form onSubmit={handleCreateInvoice}>
        <input
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
          placeholder="Invoice number (e.g. INV-001)"
          required
        />
        <input
          value={issueDate}
          onChange={(e) => setIssueDate(e.target.value)}
          type="date"
          required
        />
        <input
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          type="date"
          required
        />
        <button type="submit">Add invoice</button>
      </form>
    </div>
  );
}
