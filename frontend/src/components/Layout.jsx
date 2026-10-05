import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, LogOut } from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { logout } from "../lib/auth";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/clients", label: "Clients", icon: Users },
];

export default function Layout() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    await logout();
    setUser(null);
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <aside className="flex w-60 flex-col bg-navy text-cream">
        <div className="px-6 py-6">
          <span className="text-lg font-semibold tracking-tight">
            Invoicing
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-teal text-white"
                    : "text-seafoam hover:bg-navy-light hover:text-white"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-navy-light px-3 py-4">
          <div className="px-3 pb-2 text-sm text-seafoam">{user?.name}</div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-seafoam transition-colors hover:bg-navy-light hover:text-white"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
