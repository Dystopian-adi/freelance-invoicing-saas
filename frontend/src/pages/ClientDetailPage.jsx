import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getClient } from '../lib/clients';

export default function ClientDetailPage() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getClient(id)
      .then(setClient)
      .catch(() => setError('Client not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <Link to="/clients">&larr; Back to clients</Link>
      <h1>{client.name}</h1>
      <p>{client.email}</p>
      <p>{client.company}</p>

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
    </div>
  );
}