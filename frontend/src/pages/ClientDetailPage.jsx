import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { getClient, updateClient, deleteClient } from "../lib/clients";
import { createProject } from "../lib/projects";
import StatusBadge from "../components/StatusBadge";

const inputClass =
  "rounded-md border border-seafoam/60 px-3 py-2 text-sm text-navy outline-none focus:border-teal";
const labelClass = "text-xs font-medium text-navy/60";

export default function ClientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");

  const [projectName, setProjectName] = useState("");
  const [projectStatus, setProjectStatus] = useState("active");
  const [projectRateType, setProjectRateType] = useState("fixed");
  const [projectRate, setProjectRate] = useState("");

  useEffect(() => {
    loadClient();
  }, [id]);

  async function loadClient() {
    setLoading(true);
    try {
      const data = await getClient(id);
      setClient(data);
      setName(data.name);
      setEmail(data.email ?? "");
      setCompany(data.company ?? "");
    } catch {
      setError("Client not found");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      await updateClient(id, { name, email, company });
      setEditing(false);
      loadClient();
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(
        errors
          ? Object.values(errors).flat().join(", ")
          : "Failed to update client",
      );
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this client and all their projects/invoices?")) return;
    await deleteClient(id);
    navigate("/clients");
  }

  async function handleCreateProject(e) {
    e.preventDefault();
    setError(null);
    try {
      await createProject(id, {
        name: projectName,
        status: projectStatus,
        rate_type: projectRateType,
        rate: projectRate ? parseFloat(projectRate) : null,
      });
      setProjectName("");
      setProjectRate("");
      loadClient();
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(
        errors
          ? Object.values(errors).flat().join(", ")
          : "Failed to create project",
      );
    }
  }

  if (loading) return <p className="text-sm text-navy/60">Loading…</p>;
  if (error && !client)
    return <p className="text-sm text-status-overdue">{error}</p>;

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/clients"
        className="flex items-center gap-1 text-sm text-navy/60 hover:text-teal"
      >
        <ArrowLeft size={14} /> Back to clients
      </Link>

      <div className="mt-4 rounded-lg border border-seafoam/40 bg-white p-6">
        {editing ? (
          <form onSubmit={handleUpdate} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass}>Company</label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className={inputClass}
              />
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
              <h1 className="text-2xl font-semibold text-navy">
                {client.name}
              </h1>
              {client.email && (
                <p className="mt-1 text-sm text-navy/60">{client.email}</p>
              )}
              {client.company && (
                <p className="text-sm text-navy/60">{client.company}</p>
              )}
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

      <h2 className="mt-8 text-lg font-semibold text-navy">Projects</h2>
      <div className="mt-3 divide-y divide-seafoam/30 rounded-lg border border-seafoam/40 bg-white">
        {client.projects.length === 0 ? (
          <p className="p-6 text-sm text-navy/60">No projects yet.</p>
        ) : (
          client.projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-cream"
            >
              <span className="font-medium text-navy">{project.name}</span>
              <StatusBadge status={project.status} />
            </Link>
          ))
        )}
      </div>

      <form
        onSubmit={handleCreateProject}
        className="mt-4 flex flex-wrap items-end gap-3 rounded-lg border border-seafoam/40 bg-white p-4"
      >
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Project name</label>
          <input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Status</label>
          <select
            value={projectStatus}
            onChange={(e) => setProjectStatus(e.target.value)}
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
            value={projectRateType}
            onChange={(e) => setProjectRateType(e.target.value)}
            className={inputClass}
          >
            <option value="fixed">Fixed</option>
            <option value="hourly">Hourly</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelClass}>Rate</label>
          <input
            value={projectRate}
            onChange={(e) => setProjectRate(e.target.value)}
            type="number"
            step="0.01"
            className={`${inputClass} w-28`}
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 rounded-md bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-teal-light"
        >
          <Plus size={16} />
          Add project
        </button>
      </form>
    </div>
  );
}
