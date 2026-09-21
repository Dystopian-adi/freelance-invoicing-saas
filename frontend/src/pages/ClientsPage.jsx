import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getClients, createClient } from "../lib/clients";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    setLoading(true);
    try {
      const data = await getClients();
      setClients(data);
    } catch {
      setError("Failed to load clients");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError(null);
    try {
      await createClient({ name, email });
      setName("");
      setEmail("");
      loadClients(); // refresh the list after creating
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(
        errors
          ? Object.values(errors).flat().join(", ")
          : "Failed to create client",
      );
    }
  }

  if (loading) return <p>Loading clients...</p>;

  return (
    <div>
      <h1>Clients</h1>

      <form onSubmit={handleCreate} style={{ marginBottom: "2rem" }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Client name"
          required
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <button type="submit">Add client</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      {clients.length === 0 ? (
        <p>No clients yet.</p>
      ) : (
        <ul>
          {clients.map((client) => (
            <li key={client.id}>
              <Link to={`/clients/${client.id}`}>{client.name}</Link> —{" "}
              {client.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
