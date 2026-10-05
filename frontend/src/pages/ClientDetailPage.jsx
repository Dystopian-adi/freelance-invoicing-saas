import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getClient, updateClient, deleteClient } from "../lib/clients";
import { createProject } from "../lib/projects";

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
    let ignore = false;

    const fetchClient = async () => {
      setLoading(true);
      try {
        const data = await getClient(id);
        if (ignore) return;

        setClient(data);
        setName(data.name);
        setEmail(data.email ?? "");
        setCompany(data.company ?? "");
      } catch {
        if (!ignore) setError("Client not found");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchClient();

    return () => {
      ignore = true;
    };
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

  if (loading) return <p>Loading...</p>;
  if (error && !client) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <Link to="/clients">&larr; Back to clients</Link>

      {editing ? (
        <form onSubmit={handleUpdate}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company"
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <h1>{client.name}</h1>
          <p>{client.email}</p>
          <p>{client.company}</p>
          <button onClick={() => setEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete client</button>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Projects</h2>
      {client.projects.length === 0 ? (
        <p>No projects yet.</p>
      ) : (
        <ul>
          {client.projects.map((project) => (
            <li key={project.id}>
              <Link to={`/projects/${project.id}`}>{project.name}</Link> —{" "}
              {project.status}
            </li>
          ))}
        </ul>
      )}

      <h3>Add a project</h3>
      <form onSubmit={handleCreateProject}>
        <input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Project name"
          required
        />
        <select
          value={projectStatus}
          onChange={(e) => setProjectStatus(e.target.value)}
        >
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="archived">Archived</option>
        </select>
        <select
          value={projectRateType}
          onChange={(e) => setProjectRateType(e.target.value)}
        >
          <option value="fixed">Fixed</option>
          <option value="hourly">Hourly</option>
        </select>
        <input
          value={projectRate}
          onChange={(e) => setProjectRate(e.target.value)}
          type="number"
          step="0.01"
          placeholder="Rate"
        />
        <button type="submit">Add project</button>
      </form>
    </div>
  );
}
