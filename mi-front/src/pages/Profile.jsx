import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { obtenerPacientes } from '../services/usuarioPaciente';

const formatearFecha = (fecha) => {
  if (!fecha) return 'No registrada';

  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(fecha));
};

const obtenerEdad = (fechaNacimiento) => {
  if (!fechaNacimiento) return null;

  const nacimiento = new Date(`${fechaNacimiento.slice(0, 10)}T00:00:00`);
  if (Number.isNaN(nacimiento.getTime())) return null;

  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const faltaCumplir =
    hoy.getMonth() < nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate());

  if (faltaCumplir) edad -= 1;
  return edad >= 0 ? edad : null;
};

export default function Profile() {
  const { user } = useAuth();
  const [pacientes, setPacientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('TODOS');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarPacientes = async () => {
      try {
        const respuesta = await obtenerPacientes();
        setPacientes(respuesta.data ?? []);
      } catch (err) {
        setError(
          err.response?.data?.mensaje ||
          err.response?.data?.msg ||
          'No fue posible cargar tus pacientes.'
        );
      } finally {
        setCargando(false);
      }
    };

    cargarPacientes();
  }, []);

  const pacientesFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLocaleLowerCase('es-CO');

    return pacientes.filter((vinculo) => {
      const paciente = vinculo.paciente;
      const coincideBusqueda = [
        paciente.nombre,
        paciente.numero_documento,
        paciente.tipo_documento?.nombre,
        vinculo.tipo_relacion?.nombre,
      ]
        .filter(Boolean)
        .some((valor) => valor.toLocaleLowerCase('es-CO').includes(texto));

      const estaActivo = paciente.estado === 'ACTIVO' && vinculo.estado === 'ACTIVO';
      const coincideEstado = filtro === 'TODOS' || (filtro === 'ACTIVOS' && estaActivo);

      return coincideBusqueda && coincideEstado;
    });
  }, [pacientes, busqueda, filtro]);

  const cantidadActivos = pacientes.filter(
    ({ paciente, estado }) => paciente.estado === 'ACTIVO' && estado === 'ACTIVO'
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="mb-7">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-sky-800">
            <span>Administración de cuidados</span>
            <span className="text-slate-300">•</span>
            <span className="normal-case tracking-normal text-slate-500">
              {pacientes.length} {pacientes.length === 1 ? 'perfil vinculado' : 'perfiles vinculados'}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-sky-950 sm:text-4xl">
            Pacientes vinculados a tu cuenta
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
            {user?.nombre ? `Hola, ${user.nombre}. ` : ''}
            Consulta la información de las personas vinculadas a tu cuenta.
          </p>
        </section>

        <div className="mb-7 flex gap-3 rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm text-sky-950">
          <span aria-hidden="true" className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white font-bold text-sky-700">i</span>
          <p>
            <strong>Perfiles vinculados:</strong> aquí puedes consultar sus datos básicos y el estado de cada vínculo.
          </p>
        </div>

        <section aria-label="Buscar y filtrar pacientes" className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-sky-50 px-4 py-3 text-slate-500 focus-within:ring-2 focus-within:ring-sky-600">
            <span aria-hidden="true">⌕</span>
            <input
              className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-500"
              type="search"
              placeholder="Buscar por nombre o documento..."
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
              aria-label="Buscar paciente por nombre o documento"
            />
          </label>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Filtrar</span>
            {[
              { valor: 'TODOS', texto: `Todos (${pacientes.length})` },
              { valor: 'ACTIVOS', texto: `Activos (${cantidadActivos})` },
            ].map((opcion) => (
              <button
                key={opcion.valor}
                type="button"
                onClick={() => setFiltro(opcion.valor)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  filtro === opcion.valor
                    ? 'bg-sky-800 text-white'
                    : 'bg-sky-50 text-sky-900 hover:bg-sky-100'
                }`}
                aria-pressed={filtro === opcion.valor}
              >
                {opcion.texto}
              </button>
            ))}
          </div>
        </section>

        {cargando ? (
          <div className="rounded-2xl bg-white p-8 text-center text-slate-600 shadow-sm" role="status">
            Cargando pacientes...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800" role="alert">
            {error}
          </div>
        ) : pacientesFiltrados.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm">
            <h2 className="font-semibold text-slate-800">
              {pacientes.length === 0 ? 'Aún no tienes pacientes vinculados' : 'No encontramos pacientes'}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {pacientes.length === 0
                ? 'Cuando vincules un paciente, su información aparecerá aquí.'
                : 'Prueba con otro nombre o número de documento.'}
            </p>
          </div>
        ) : (
          <section aria-label="Pacientes vinculados" className="grid gap-5 lg:grid-cols-2">
            {pacientesFiltrados.map((vinculo) => {
              const paciente = vinculo.paciente;
              const activo = paciente.estado === 'ACTIVO' && vinculo.estado === 'ACTIVO';
              const edad = obtenerEdad(paciente.fecha_nacimiento);

              return (
                <article key={vinculo.id} className="relative rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
                  <div className="absolute -top-3 right-5 rounded-full bg-sky-800 px-4 py-1.5 text-xs font-bold text-white shadow-sm">
                    <span className={`mr-1.5 inline-block h-2 w-2 rounded-full ${activo ? 'bg-emerald-300' : 'bg-slate-300'}`} />
                    {activo ? 'PACIENTE ACTIVO' : 'INACTIVO'}
                  </div>

                  <div className="flex items-start gap-4 pt-2">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-xl font-bold text-sky-800" aria-hidden="true">
                      {paciente.nombre?.trim()?.charAt(0)?.toLocaleUpperCase('es-CO') || '?'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-semibold text-sky-950">{paciente.nombre}</h2>
                        <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-medium text-sky-900">
                          {vinculo.tipo_relacion?.nombre || 'Relación sin especificar'}
                        </span>
                        {edad !== null && (
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                            {edad} {edad === 1 ? 'año' : 'años'}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-slate-600">
                        {paciente.tipo_documento?.nombre || 'Documento'}: {paciente.numero_documento}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Género: {paciente.genero?.nombre || 'No especificado'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-sky-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-sky-800">Dirección</p>
                      <p className="mt-2 text-sm text-slate-700">{paciente.direccion || 'No registrada'}</p>
                    </div>
                    <div className="rounded-xl bg-sky-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-sky-800">Vinculado desde</p>
                      <p className="mt-2 text-sm text-slate-700">{formatearFecha(vinculo.fecha_vinculacion)}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
