import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../lib/auth';
import { useAuth } from '../lib/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('test@test.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState(null);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const userData = await login(email, password);
      setUser(userData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Log in</h1>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
      <button type="submit">Log in</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>No account? <Link to="/register">Register</Link></p>
    </form>
  );
}