import { useAuth } from '../lib/AuthContext';
import { logout } from '../lib/auth';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    setUser(null);
    navigate('/login');
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.name}</p>
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
}