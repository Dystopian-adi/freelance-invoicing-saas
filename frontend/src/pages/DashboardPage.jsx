import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, ArrowRight } from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { getClients } from "../lib/clients";

export default function DashboardPage() {
  const { user } = useAuth();
  const [clientCount, setClientCount] = useState(null);

  useEffect(() => {
    getClients().then((clients) => setClientCount(clients.length));
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold text-navy">
        Welcome back, {user?.name?.split(" ")[0]}
      </h1>
      <p className="mt-1 text-sm text-navy/60">
        Here's a quick look at your account.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-seafoam/40 bg-white p-5">
          <div className="flex items-center gap-2 text-navy/50">
            <Users size={16} />
            <span className="text-xs font-medium">Clients</span>
          </div>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-navy">
            {clientCount ?? "—"}
          </p>
        </div>
      </div>

      <Link
        to="/clients"
        className="mt-6 flex items-center justify-between rounded-lg bg-navy px-5 py-4 text-sm font-medium text-cream hover:bg-navy-light"
      >
        View all clients
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
