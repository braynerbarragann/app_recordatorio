import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import loginImage from '../../assets/login-care.webp';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const onChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setCargando(true);

    try {
      await login(form.email, form.password);
      navigate('/perfil');
    } catch (err) {
      setError(
        err.response?.data?.msg ||
        err.response?.data?.mensaje ||
        'No se pudo iniciar sesión. Revisa tu correo y contraseña.'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen bg-transparent p-3 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-7xl overflow-hidden rounded-3xl gap-4 sm:min-h-[calc(100vh-3rem)] lg:grid-cols-2">
        {/* Panel informativo */}
        <section className="order-2 rounded-3xl bg-gradient-to-br from-cyan-950 via-cyan-900 to-sky-800 p-6 text-white shadow-xl sm:p-9 lg:order-1">
          <p className="inline-flex rounded-full bg-cyan-950/70 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-sky-100">
            Organización para el cuidado familiar
          </p>

          <h1 className="mt-7 max-w-lg text-3xl font-bold leading-tight sm:text-4xl">
            Tu tranquilidad en cada toma.
          </h1>

          <p className="mt-4 max-w-lg leading-7 text-sky-100">
            Organiza citas, diagnósticos y tratamientos de tu familia y lleva
            un registro de las tomas de medicamentos.
          </p>

          <div className="relative mt-7 overflow-hidden rounded-2xl">
            <img
              src={loginImage}
              alt="Una persona cuidadora acompañando a un adulto mayor"
              className="h-52 w-full object-cover sm:h-64"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-cyan-950/80 to-transparent"
            />
            <p className="absolute bottom-4 left-4 rounded-lg bg-cyan-950/70 px-3 py-2 text-sm font-medium">
              Cuidado organizado para la familia
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {[
              ['Perfiles familiares', 'Consulta los pacientes vinculados a tu cuenta.'],
              ['Agenda organizada', 'Revisa citas, diagnósticos y tratamientos.'],
              ['Registro de tomas', 'Consulta las tomas programadas y sus estados.'],
            ].map(([titulo, descripcion]) => (
              <div
                key={titulo}
                className="rounded-xl bg-cyan-950/40 p-4"
              >
                <p className="font-semibold">{titulo}</p>
                <p className="mt-1 text-sm text-sky-100">{descripcion}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Formulario */}
        <section className="order-1 flex flex-col justify-between rounded-3xl border border-white/80 bg-white/95 p-6 shadow-xl sm:p-10 lg:order-2">
          <div className="mx-auto w-full max-w-xl">
            <div className="mb-8 flex justify-center sm:justify-end">
              <p className="text-sm text-slate-600">
                ¿No tienes cuenta?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-sky-700 underline underline-offset-4 hover:text-sky-900"
                >
                  Regístrate
                </Link>
              </p>
            </div>

            <div className="text-center">
              <span className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-cyan-800">
              

                <span class="material-symbols-outlined" translate="no"
                  aria-hidden="true" >
                  person
                </span>

              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-cyan-950 sm:text-4xl">
                Iniciar sesión
              </h2>
              <p className="mt-2 text-slate-600">
                Ingresa a tu cuenta de cuidador o paciente.
              </p>
            </div>

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-cyan-950"
                >
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={onChange}
                  required
                  className="w-full rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  placeholder="tu.correo@ejemplo.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-cyan-950"
                >
                  Contraseña
                </label>

                <div className="flex rounded-xl border border-sky-100 bg-sky-50 focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-200">
                  <input
                    id="password"
                    name="password"
                    type={mostrarContrasena ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={form.password}
                    onChange={onChange}
                    required
                    className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400"
                    placeholder="Ingresa tu contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarContrasena(!mostrarContrasena)}
                    aria-label={mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    className="px-4 text-sm font-semibold text-cyan-800 hover:text-cyan-950"
                  >
                    {mostrarContrasena ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={cargando}
                className="w-full rounded-xl bg-cyan-950 px-5 py-3.5 font-semibold text-white shadow-md transition hover:bg-cyan-800 disabled:cursor-wait disabled:opacity-60"
              >
                {cargando ? 'Ingresando…' : 'Iniciar sesión'}
              </button>
            </form>
          </div>

          <p className="mx-auto mt-8 max-w-xl text-sm text-slate-500">
            La aplicación ayuda a organizar información y recordatorios; sigue
            siempre las indicaciones de tus profesionales de salud.
          </p>
        </section>
      </div>
    </main>
  );
}
