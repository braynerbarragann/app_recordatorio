import { Routes, Route, Link, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Home from './pages/Home';
import Navbar from './components/Navbar';

export default function App() {

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/perfil" replace/>} />
        <Route path="/home" element={<Home />} />
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