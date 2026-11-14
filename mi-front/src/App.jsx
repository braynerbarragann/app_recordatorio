import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Profile from './pages/pacientes/Profile';
import EditProfile from './pages/usuario/EditProfile';
import EditarPaciente from './pages/pacientes/EditarPaciente';
import PanelPaciente from './pages/pacientes/PanelPaciente';
import RegistrarPaciente from './pages/pacientes/RegistrarPaciente';
import Home from './pages/Home';
import Navbar from './components/Navbar';

export default function App() {

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/perfil" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/perfil" element={<Profile />} />
          <Route path="/perfil/editar" element={<EditProfile />} />
          <Route path="/pacientes/registrar" element={<RegistrarPaciente />} />
          <Route path="/pacientes/:pacienteId/editar" element={<EditarPaciente />} />
          <Route path="/pacientes/:pacienteId" element={<PanelPaciente />} />
        </Route>

        <Route path="*" element={<p>Página no encontrada</p>} />
      </Routes>
    </>
  );
}
