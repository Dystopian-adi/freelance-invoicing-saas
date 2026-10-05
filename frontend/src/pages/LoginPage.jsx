import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../lib/auth";
import { useAuth } from "../lib/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState(null);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const userData = await login(email, password);
      setUser(userData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-2xl font-semibold text-navy">
          Invoicing
        </h1>
        <p className="mt-1 text-center text-sm text-navy/60">
          Log in to your account
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col gap-4 rounded-lg border border-seafoam/40 bg-white p-6"
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-navy/60">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="rounded-md border border-seafoam/60 px-3 py-2 text-sm text-navy outline-none focus:border-teal"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-navy/60">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              className="rounded-md border border-seafoam/60 px-3 py-2 text-sm text-navy outline-none focus:border-teal"
            />
          </div>
          <button
            type="submit"
            className="mt-2 rounded-md bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-teal-light"
          >
            Log in
          </button>
          {error && <p className="text-sm text-status-overdue">{error}</p>}
        </form>

        <p className="mt-4 text-center text-sm text-navy/60">
          No account?{" "}
          <Link
            to="/register"
            className="font-medium text-teal hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
