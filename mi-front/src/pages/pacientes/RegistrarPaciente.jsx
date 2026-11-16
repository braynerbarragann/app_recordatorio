
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  obtenerTiposDocumento,
  obtenerGeneros,
  obtenerTiposRelacion,
} from '../../services/catalogos';

import { registrarPaciente } from '../../services/usuarioPaciente';

const formularioInicial = {
  tipo_documento_id: '',
  genero_id: '',
  nombre: '',
  numero_documento: '',
  fecha_nacimiento: '',
  direccion: '',
  tipo_relacion_id: '',
};

export default function RegistrarPaciente() {
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState(formularioInicial);
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [tiposRelacion, setTiposRelacion] = useState([]);

  const [cargandoCatalogos, setCargandoCatalogos] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        const [documentos, generosRespuesta, relaciones] =
          await Promise.all([
            obtenerTiposDocumento(),
            obtenerGeneros(),
            obtenerTiposRelacion(),
          ]);

        setTiposDocumento(documentos.data ?? []);
        setGeneros(generosRespuesta.data ?? []);
        setTiposRelacion(relaciones.data ?? []);
      } catch (err) {
        setError(
          err.response?.data?.msg ||
          'No fue posible cargar los datos del formulario.'
        );
      } finally {
        setCargandoCatalogos(false);
      }
    };

    cargarCatalogos();
  }, []);

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;

    setFormulario((actual) => ({
      ...actual,
      [name]: value,
    }));
  };

  const manejarEnvio = async (evento) => {
    evento.preventDefault();
    setError('');

    if (
      !formulario.tipo_documento_id ||
      !formulario.genero_id ||
      !formulario.nombre.trim() ||
      !formulario.numero_documento.trim() ||
      !formulario.tipo_relacion_id
    ) {
      setError('Completa todos los campos obligatorios.');
      return;
    }

    const datos = {
      tipo_documento_id: Number(formulario.tipo_documento_id),
      genero_id: Number(formulario.genero_id),
      nombre: formulario.nombre.trim(),
      numero_documento: formulario.numero_documento.trim(),
      fecha_nacimiento: formulario.fecha_nacimiento || null,
      direccion: formulario.direccion.trim() || null,
      tipo_relacion_id: Number(formulario.tipo_relacion_id),
    };

    try {
      setGuardando(true);

      await registrarPaciente(datos);

      navigate('/perfil', {
        state: { mensaje: 'Paciente registrado correctamente.' },
      });
    } catch (err) {
      setError(
        err.response?.data?.msg ||
        err.response?.data?.mensaje ||
        'No fue posible registrar el paciente.'
      );
    } finally {
      setGuardando(false);
    }
  };

  if (cargandoCatalogos) {
    return (
      <main className="min-h-screen bg-slate-50 p-8 text-center text-slate-600">
        Cargando formulario...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-800">
      <section className="mx-auto max-w-3xl rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-7">
          <Link
            to="/perfil"
            className="text-sm font-semibold text-sky-800 hover:text-sky-950"
          >
            ← Volver a pacientes
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-sky-950">
            Registrar paciente
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Ingresa los datos de la persona que deseas vincular a tu cuenta.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            {error}
          </div>
        )}

        <form onSubmit={manejarEnvio} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Tipo de documento *
              </label>
              <select
                name="tipo_documento_id"
                value={formulario.tipo_documento_id}
                onChange={manejarCambio}
                required
                className="w-full rounded-xl border border-slate-300 px-3 py-3"
              >
                <option value="">Selecciona una opción</option>
                {tiposDocumento.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Número de documento *
              </label>
              <input
                name="numero_documento"
                value={formulario.numero_documento}
                onChange={manejarCambio}
                required
                className="w-full rounded-xl border border-slate-300 px-3 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Nombre completo *
              </label>
              <input
                name="nombre"
                value={formulario.nombre}
                onChange={manejarCambio}
                required
                className="w-full rounded-xl border border-slate-300 px-3 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Género *
              </label>
              <select
                name="genero_id"
                value={formulario.genero_id}
                onChange={manejarCambio}
                required
                className="w-full rounded-xl border border-slate-300 px-3 py-3"
              >
                <option value="">Selecciona una opción</option>
                {generos.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Fecha de nacimiento
              </label>
              <input
                type="date"
                name="fecha_nacimiento"
                value={formulario.fecha_nacimiento}
                onChange={manejarCambio}
                className="w-full rounded-xl border border-slate-300 px-3 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Tipo de relación *
              </label>
              <select
                name="tipo_relacion_id"
                value={formulario.tipo_relacion_id}
                onChange={manejarCambio}
                required
                className="w-full rounded-xl border border-slate-300 px-3 py-3"
              >
                <option value="">Selecciona una opción</option>
                {tiposRelacion.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Dirección
            </label>
            <textarea
              name="direccion"
              value={formulario.direccion}
              onChange={manejarCambio}
              rows="3"
              className="w-full rounded-xl border border-slate-300 px-3 py-3"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <Link
              to="/perfil"
              className="rounded-xl border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={guardando}
              className="rounded-xl bg-sky-800 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {guardando ? 'Registrando...' : 'Registrar paciente'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
