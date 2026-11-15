
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
      <main className="min-h-screen bg-slate-50 p-8 text-center text-slate-600">
        Cargando información del paciente...
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
            Editar datos del paciente
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Modifica la información del paciente seleccionado.
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
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
