import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { logout } from "../lib/auth";

export default function Layout() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    setUser(null);
    navigate("/login");
  }

  return (
    <div>
      <nav
        style={{
          display: "flex",
          gap: "1rem",
          padding: "1rem",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/clients">Clients</Link>
        <span style={{ marginLeft: "auto" }}>{user?.name}</span>
        <button onClick={handleLogout}>Log out</button>
      </nav>
      <main style={{ padding: "1rem" }}>
        <Outlet />
      </main>
    </div>
  );
}
