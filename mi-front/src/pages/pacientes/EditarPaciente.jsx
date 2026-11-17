
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  obtenerTiposDocumento,
  obtenerGeneros,
} from '../../services/catalogos';

import {
  obtenerPaciente,
  actualizarPaciente,
} from '../../services/usuarioPaciente';

const formularioInicial = {
  tipo_documento_id: '',
  genero_id: '',
  nombre: '',
  numero_documento: '',
  fecha_nacimiento: '',
  direccion: '',
};

export default function EditarPaciente() {
  const { pacienteId } = useParams();
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState(formularioInicial);
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [generos, setGeneros] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [pacienteRespuesta, documentos, generosRespuesta] =
          await Promise.all([
            obtenerPaciente(pacienteId),
            obtenerTiposDocumento(),
            obtenerGeneros(),
          ]);

        const paciente = pacienteRespuesta.data;

        setFormulario({
          tipo_documento_id: String(paciente.tipo_documento?.id ?? ''),
          genero_id: String(paciente.genero?.id ?? ''),
          nombre: paciente.nombre ?? '',
          numero_documento: paciente.numero_documento ?? '',
          fecha_nacimiento: paciente.fecha_nacimiento
            ? String(paciente.fecha_nacimiento).slice(0, 10)
            : '',
          direccion: paciente.direccion ?? '',
        });

        setTiposDocumento(documentos.data ?? []);
        setGeneros(generosRespuesta.data ?? []);
      } catch (err) {
        setError(
          err.response?.data?.msg ||
          'No fue posible cargar la información del paciente.'
        );
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [pacienteId]);

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
      !formulario.numero_documento.trim()
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
    };

    try {
      setGuardando(true);

      await actualizarPaciente(pacienteId, datos);

      navigate('/perfil', {
        state: { mensaje: 'Paciente actualizado correctamente.' },
      });
    } catch (err) {
      setError(
        err.response?.data?.msg ||
        err.response?.data?.mensaje ||
        'No fue posible actualizar el paciente.'
      );
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <main className="min-h-screen bg-transparent p-8 text-center text-slate-600">
        Cargando información del paciente...
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
                person_edit
              </span>
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-cyan-950">
              Editar datos del paciente
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Modifica la información del paciente seleccionado.
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
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
