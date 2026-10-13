import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { actualizarPerfil, obtenerPerfil } from '../services/auth';

export default function EditProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user.name, email: user.email });
  const [error, setError] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await actualizarPerfil(form);
      setUser(await obtenerPerfil()); // refresca los datos mostrados
      navigate('/perfil');
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo actualizar');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Editar perfil</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p><input name="name" value={form.name} onChange={onChange} placeholder="Nombre" required /></p>
      <p><input name="email" type="email" value={form.email} onChange={onChange} placeholder="Correo" required /></p>
      <button type="submit">Guardar cambios</button>{' '}
      <button type="button" onClick={() => navigate('/perfil')}>Cancelar</button>
    </form>
  );
}