import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProject } from "../lib/projects";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProject(id)
      .then(setProject)
      .catch(() => setError("Project not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <Link to={`/clients/${project.client_id}`}>&larr; Back to client</Link>
      <h1>{project.name}</h1>
      <p>{project.description}</p>
      <p>Status: {project.status}</p>
      <p>
        Rate: {project.rate_type} — {project.rate}
      </p>

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
    </div>
  );
}
