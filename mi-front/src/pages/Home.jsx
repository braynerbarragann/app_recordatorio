import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const caracteristicas = [
  {
    icono: 'timer',
    titulo: 'Control de tomas y medicamentos',
    descripcion:
      'Organiza los medicamentos, las dosis y los horarios indicados para cada paciente.',
    detalle: 'Seguimiento de tratamientos',
    color: 'bg-cyan-900',
  },
  {
    icono: 'diversity_1',
    titulo: 'Gestión multipaciente',
    descripcion:
      'Vincula perfiles y consulta la información de cada persona desde tu cuenta.',
    detalle: 'Perfiles organizados',
    color: 'bg-cyan-800',
  },
  {
    icono: 'event',
    titulo: 'Agenda de citas',
    descripcion:
      'Registra y consulta las citas médicas de los pacientes vinculados.',
    detalle: 'Citas en un solo lugar',
    color: 'bg-sky-700',
  },
  {
    icono: 'diagnosis',
    titulo: 'Diagnósticos y tratamientos',
    descripcion:
      'Mantén organizados los diagnósticos y tratamientos asociados a cada paciente.',
    detalle: 'Historial organizado',
    color: 'bg-emerald-800',
  },
];

const beneficios = [
  {
    numero: '01',
    titulo: 'Información organizada',
    descripcion:
      'Consulta perfiles, citas y tratamientos desde un mismo espacio.',
  },
  {
    numero: '02',
    titulo: 'Seguimiento más claro',
    descripcion:
      'Revisa las indicaciones y horarios registrados para cada paciente.',
  },
  {
    numero: '03',
    titulo: 'Perfiles separados',
    descripcion:
      'Mantén la información asociada al paciente correspondiente.',
  },
];

export default function Home() {
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;

    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }, [location.pathname, location.hash]);

  return (
    <main className="app-background">
      {/* Portada */}
      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-24 -z-0 size-80 rounded-full bg-sky-200/40 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 left-1/4 -z-0 size-80 rounded-full bg-cyan-100/60 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-2 lg:gap-16 lg:px-8">
          <div>
            <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-sm font-medium text-cyan-900">
              <span aria-hidden="true" className="text-emerald-700">✓</span>
              Organiza citas y tratamientos en un solo lugar
            </p>

            <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-cyan-950 sm:text-5xl">
              La tranquilidad de cuidar la salud de quienes más amas,{' '}
              <span className="text-sky-700">organizada en un solo lugar.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Organiza citas, diagnósticos, tratamientos y el seguimiento de las
              tomas de medicamentos de uno o varios familiares.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {user ? (
                <Link
                  to="/perfil"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-cyan-900 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-cyan-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-900"
                >
                  Ir a mi perfil
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex min-h-12 items-center justify-center rounded-xl bg-cyan-900 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-cyan-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-900"
                  >
                    Crear cuenta
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex min-h-12 items-center justify-center rounded-xl border border-sky-200 bg-white/60 px-6 py-3 font-semibold text-cyan-950 transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-900"
                  >
                    Iniciar sesión
                  </Link>
                </>
              )}
            </div>

            <div className="mt-10 grid gap-5 border-t border-sky-200 pt-6 sm:grid-cols-3">
              <div>
                <p className="font-bold text-cyan-950">Citas</p>
                <p className="mt-1 text-sm text-slate-600">Consulta las citas registradas</p>
              </div>
              <div>
                <p className="font-bold text-cyan-950">Tratamientos</p>
                <p className="mt-1 text-sm text-slate-600">Mantén su información organizada</p>
              </div>
              <div>
                <p className="font-bold text-cyan-950">Familia</p>
                <p className="mt-1 text-sm text-slate-600">Gestiona pacientes vinculados</p>
              </div>
            </div>
          </div>

          {/* Tarjeta ilustrativa */}
          <div className="relative mx-auto w-full max-w-xl">
            <div
              aria-hidden="true"
              className="absolute inset-3 translate-x-3 translate-y-3 rounded-3xl bg-sky-200/70"
            />
            <section
              aria-label="Vista demostrativa del seguimiento de salud"
              className="relative rounded-3xl border border-cyan-800 bg-cyan-950 p-5 text-white shadow-xl shadow-cyan-950/20 sm:p-6"
            >
              <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-cyan-800 bg-cyan-900/50 p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full border border-cyan-500 bg-cyan-950 font-bold text-cyan-200">
                    CF
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">
                      Carmen Flores
                      <span className="ml-2 rounded-full border border-cyan-700 px-2 py-0.5 text-sm font-normal text-cyan-300">Mamá</span>
                    </p>
                    <p className="truncate text-sm text-cyan-200">Perfil de ejemplo</p>
                  </div>
                </div>
                <span className="shrink-0 rounded-lg border border-cyan-700 bg-cyan-800/60 px-3 py-2 text-sm text-cyan-100">Demo</span>
              </div>

              <div className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-emerald-800 bg-emerald-950/70 p-4">
                <div>
                  <p className="font-semibold text-emerald-200">Seguimiento de hoy</p>
                  <p className="text-sm text-emerald-300">2 de 3 tomas registradas</p>
                </div>
                <span className="rounded-xl border border-emerald-700 bg-emerald-900/60 px-3 py-1 text-lg font-bold text-emerald-300">2/3</span>
              </div>

              <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-wide text-cyan-300">
                <span>Próxima toma</span>
                <span>08:30 a. m.</span>
              </div>
              <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-slate-700 bg-slate-800/80 p-4">
                <div>
                  <p className="font-semibold text-white">Medicamento de ejemplo</p>
                  <p className="text-sm text-cyan-100">Dosis e instrucción del tratamiento</p>
                </div>
                <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-cyan-900/70 text-xl text-cyan-300">◷</span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-cyan-800 bg-cyan-900/60 p-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">Próxima consulta</p>
                  <p className="mt-1 font-semibold text-white">Cita de ejemplo</p>
                  <p className="text-sm text-cyan-100">Fecha y hora programadas</p>
                </div>
                <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-cyan-800/70 text-xl text-cyan-200">→</span>
              </div>
              <p className="mt-4 border-t border-cyan-900 pt-4 text-center text-xs text-cyan-300">
                La información de esta tarjeta es ilustrativa.
              </p>
            </section>
          </div>
        </div>
      </section>

      {/* Características */}
      <section id="caracteristicas" className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-wide text-sky-700">
            Capacidades del sistema
          </p>
          <div className="mt-2 grid gap-5 md:grid-cols-2 md:items-end">
            <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-cyan-950 sm:text-4xl">
              Diseñado para reducir la confusión y ayudar a cuidar la salud en casa.
            </h2>
            <p className="max-w-xl leading-7 text-slate-600 md:justify-self-end">
              Funciones para organizar el cuidado familiar de forma sencilla y clara.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {caracteristicas.map((caracteristica) => (
              <article key={caracteristica.titulo} className="flex min-h-80 flex-col rounded-2xl border border-cyan-800 bg-cyan-950 p-6 text-white shadow-lg shadow-cyan-950/15">
                <span aria-hidden="true" className={`flex h-14 w-14 items-center justify-center rounded-xl border border-cyan-700 ${caracteristica.color} text-white shadow`}>
                  <span translate="no" className="material-symbols-outlined notranslate text-3xl">
                    {caracteristica.icono}
                  </span>
                </span>
                <h3 className="mt-5 text-xl font-semibold text-white">
                  {caracteristica.titulo}
                </h3>
                <p className="mt-3 leading-6 text-cyan-100">
                  {caracteristica.descripcion}
                </p>
                <span className="mt-auto pt-6 text-sm font-semibold text-cyan-300">
                  {caracteristica.detalle} →
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Para quién es */}
      <section id="para-quien" className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-sky-700">¿Para quién es?</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-cyan-950 sm:text-4xl">
              Para quienes acompañan el cuidado de su familia.
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-slate-600">
              Recordatorio Salud ayuda a cuidadores y familias a mantener reunida
              la información cotidiana de los pacientes que tienen vinculados.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ['Familiares', 'Organiza la información de padres, hijos u otros seres queridos.'],
              ['Cuidadores', 'Consulta los datos básicos y los registros disponibles de cada perfil.'],
            ].map(([titulo, descripcion]) => (
              <article key={titulo} className="rounded-2xl border border-cyan-800 bg-cyan-950 p-6 text-white shadow-lg shadow-cyan-950/15">
                <h3 className="text-lg font-semibold text-white">{titulo}</h3>
                <p className="mt-2 text-sm leading-6 text-cyan-100">{descripcion}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section id="beneficios" className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-wide text-sky-700">Beneficios</p>
          <h2 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-cyan-950 sm:text-4xl">
            Una forma más clara de organizar el cuidado diario.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {beneficios.map((beneficio) => (
              <article key={beneficio.numero} className="rounded-2xl border border-cyan-800 bg-cyan-950 p-6 text-white shadow-lg shadow-cyan-950/15">
                <span className="text-sm font-bold text-cyan-300">{beneficio.numero}</span>
                <h3 className="mt-4 text-xl font-semibold text-white">{beneficio.titulo}</h3>
                <p className="mt-3 leading-6 text-cyan-100">{beneficio.descripcion}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Privacidad */}
      <section id="privacidad" className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-sky-700">Privacidad</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-cyan-950 sm:text-4xl">
              Tus perfiles se gestionan desde tu cuenta.
            </h2>
          </div>
          <div>
            <p className="leading-7 text-slate-600">
              El acceso a las funciones privadas requiere iniciar sesión. Desde tu
              cuenta puedes consultar los pacientes vinculados a ti y la información
              asociada a esos perfiles.
            </p>
            {!user && (
              <Link
                to="/register"
                className="mt-6 inline-flex rounded-xl bg-cyan-900 px-5 py-3 font-semibold text-white transition hover:bg-cyan-800"
              >
                Crear cuenta
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
