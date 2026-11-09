import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';

export default function App() {
  const { user, logout } = useAuth();

  return (
    <>
      <nav>
        {user ? (
          <>
            <Link to="/perfil">Mi perfil</Link>
            <button onClick={logout}>Salir</button>
          </>
        ) : (
          <>
            <Link to="/login">Ingresar</Link>
            <Link to="/register">Registrarse</Link>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/perfil" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/perfil" element={<Profile />} />
          <Route path="/perfil/editar" element={<EditProfile />} />
        </Route>

        <Route path="*" element={<p>Página no encontrada</p>} />
      </Routes>
    </>
  );
}