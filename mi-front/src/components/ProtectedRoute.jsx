import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <p>Cargando...</p>;

  return user ? <Outlet /> : <Navigate to="/home" replace />;
}