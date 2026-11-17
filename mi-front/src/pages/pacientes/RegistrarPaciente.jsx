
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
      <main className="min-h-screen bg-transparent p-8 text-center text-slate-600">
        Cargando formulario...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-transparent px-4 py-8 text-slate-800">
      <section className="mx-auto max-w-3xl rounded-3xl border border-white/80 bg-white/95 p-6 shadow-xl sm:p-8">
        <div className="mb-7">
          <Link
            to="/perfil"
            className="inline-flex rounded-lg border border-sky-100 bg-sky-50 px-3 py-2 text-sm font-semibold text-cyan-900 transition hover:bg-sky-100"
          >
            ← Volver a pacientes
          </Link>

          <div className="mt-4 text-center">
            <span className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-cyan-800">
              <span
                className="material-symbols-outlined notranslate text-4xl"
                translate="no"
                aria-hidden="true"
              >
                person_add
              </span>
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-cyan-950">
              Registrar paciente
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Ingresa los datos de la persona que deseas vincular a tu cuenta.
            </p>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
          >
            {error}
          </div>
        )}

        <form onSubmit={manejarEnvio} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-cyan-950">
                Tipo de documento *
              </label>
              <select
                name="tipo_documento_id"
                value={formulario.tipo_documento_id}
                onChange={manejarCambio}
                required
                className="w-full rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
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
              <label className="mb-2 block text-sm font-semibold text-cyan-950">
                Número de documento *
              </label>
              <input
                name="numero_documento"
                value={formulario.numero_documento}
                onChange={manejarCambio}
                required
                className="w-full rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-cyan-950">
                Nombre completo *
              </label>
              <input
                name="nombre"
                value={formulario.nombre}
                onChange={manejarCambio}
                required
                className="w-full rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-cyan-950">
                Género *
              </label>
              <select
                name="genero_id"
                value={formulario.genero_id}
                onChange={manejarCambio}
                required
                className="w-full rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
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
              <label className="mb-2 block text-sm font-semibold text-cyan-950">
                Fecha de nacimiento
              </label>
              <input
                type="date"
                name="fecha_nacimiento"
                value={formulario.fecha_nacimiento}
                onChange={manejarCambio}
                className="w-full rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-cyan-950">
                Tipo de relación *
              </label>
              <select
                name="tipo_relacion_id"
                value={formulario.tipo_relacion_id}
                onChange={manejarCambio}
                required
                className="w-full rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
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
            <label className="mb-2 block text-sm font-semibold text-cyan-950">
              Dirección
            </label>
            <textarea
              name="direccion"
              value={formulario.direccion}
              onChange={manejarCambio}
              rows="3"
              className="w-full rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <Link
              to="/perfil"
              className="rounded-xl border border-sky-200 bg-white px-5 py-3 text-center text-sm font-semibold text-cyan-900 transition hover:bg-sky-50"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={guardando}
              className="rounded-xl bg-cyan-950 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {guardando ? 'Registrando...' : 'Registrar paciente'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
