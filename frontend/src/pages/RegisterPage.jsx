import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../lib/auth";
import { useAuth } from "../lib/AuthContext";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState(null);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const userData = await register(
        name,
        email,
        password,
        passwordConfirmation,
      );
      setUser(userData);
      navigate("/dashboard");
    } catch (err) {
      const errors = err.response?.data?.errors;
      setError(
        errors
          ? Object.values(errors).flat().join(", ")
          : "Registration failed",
      );
    }
  }

  const inputClass =
    "rounded-md border border-seafoam/60 px-3 py-2 text-sm text-navy outline-none focus:border-teal";
  const labelClass = "text-xs font-medium text-navy/60";

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-2xl font-semibold text-navy">
          Invoicing
        </h1>
        <p className="mt-1 text-center text-sm text-navy/60">
          Create your account
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col gap-4 rounded-lg border border-seafoam/40 bg-white p-6"
        >
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
              type="email"
              required
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Confirm password</label>
            <input
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              type="password"
              required
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            className="mt-2 rounded-md bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-teal-light"
          >
            Register
          </button>
          {error && <p className="text-sm text-status-overdue">{error}</p>}
        </form>

        <p className="mt-4 text-center text-sm text-navy/60">
          Have an account?{" "}
          <Link to="/login" className="font-medium text-teal hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
