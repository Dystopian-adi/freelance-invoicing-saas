import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
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
      loadClients();
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(
        errors
          ? Object.values(errors).flat().join(", ")
          : "Failed to create client",
      );
    }
  }

  if (loading) return <p className="text-sm text-navy/60">Loading clients…</p>;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold text-navy">Clients</h1>
      <p className="mt-1 text-sm text-navy/60">
        People and companies you invoice.
      </p>

      <form
        onSubmit={handleCreate}
        className="mt-6 flex flex-wrap items-end gap-3 rounded-lg border border-seafoam/40 bg-white p-4"
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-navy/60">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Acme Corp"
            required
            className="rounded-md border border-seafoam/60 px-3 py-2 text-sm text-navy outline-none focus:border-teal"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-navy/60">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="billing@acme.com"
            className="rounded-md border border-seafoam/60 px-3 py-2 text-sm text-navy outline-none focus:border-teal"
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 rounded-md bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-teal-light"
        >
          <Plus size={16} />
          Add client
        </button>
        {error && <p className="w-full text-sm text-status-overdue">{error}</p>}
      </form>

      <div className="mt-6 divide-y divide-seafoam/30 rounded-lg border border-seafoam/40 bg-white">
        {clients.length === 0 ? (
          <p className="p-6 text-sm text-navy/60">
            No clients yet — add your first one above.
          </p>
        ) : (
          clients.map((client) => (
            <Link
              key={client.id}
              to={`/clients/${client.id}`}
              className="flex items-center justify-between px-4 py-3 text-sm transition-colors hover:bg-cream"
            >
              <span className="font-medium text-navy">{client.name}</span>
              <span className="text-navy/50">{client.email}</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
