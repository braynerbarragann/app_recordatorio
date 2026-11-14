
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import {
  actualizarPerfil,
  obtenerPerfil
} from '../services/auth';

export default function EditProfile() {

  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: user?.nombre || '',
    correo: user?.correo || '',
    telefono: user?.telefono || ''
  });

  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  // Actualizar campos del formulario
  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Guardar cambios
  const onSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setMensaje('');
    setCargando(true);

    try {

      // Actualizar datos en el backend
      await actualizarPerfil({
        nombre: form.nombre.trim(),
        correo: form.correo.trim(),
        telefono: form.telefono.trim() || null
      });

      // Consultar nuevamente el perfil actualizado
      const respuesta = await obtenerPerfil();

      // El backend devuelve { ok: true, data: {...} }
      setUser(respuesta.data);

      setMensaje('Perfil actualizado correctamente');

      // Regresar al perfil
      navigate('/perfil');

    } catch (err) {

      setError(
        err.response?.data?.msg ||
        err.response?.data?.mensaje ||
        'No fue posible actualizar el perfil'
      );

    } finally {
      setCargando(false);
    }
  };

  return (

    <main className="min-h-screen bg-slate-50 px-4 py-10">

      <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-sm">

        <h1 className="mb-2 text-2xl font-bold text-sky-950">
          Actualizar perfil
        </h1>

        <p className="mb-6 text-sm text-slate-500">
          Modifica los datos personales de tu cuenta MediTime.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {mensaje && (
          <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {mensaje}
          </div>
        )}

        <form onSubmit={onSubmit}>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
              Nombre completo
            </label>

            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={onChange}
              required
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-sky-600"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
              Correo electrónico
            </label>

            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={onChange}
              required
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-sky-600"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium">
              Teléfono
            </label>

            <input
              type="tel"
              name="telefono"
              value={form.telefono}
              onChange={onChange}
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-sky-600"
            />
          </div>

          <div className="flex flex-wrap gap-3">

            <button
              type="submit"
              disabled={cargando}
              className="rounded-lg bg-sky-900 px-5 py-3 font-semibold text-white hover:bg-sky-800 disabled:opacity-50"
            >
              {cargando ? 'Guardando...' : 'Guardar cambios'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/perfil')}
              className="rounded-lg bg-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-300"
            >
              Cancelar
            </button>

          </div>

        </form>

      </div>

    </main>
  );
}
