import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);

  const cerrarMenus = () => {
    setMenuMovilAbierto(false);
    setMenuUsuarioAbierto(false);
  };

  const cerrarSesion = () => {
    cerrarMenus();
    logout();
  };

  return (
    <header className="relative z-20 border-b border-sky-100 bg-white">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
        aria-label="Navegación principal"
      >
        <Link
          to={user ? '/perfil' : '/home'}
          onClick={cerrarMenus}
          className="flex shrink-0 items-center gap-3"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-950 text-white">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6"
            >
              <rect x="5" y="4" width="14" height="17" rx="2" />
              <path d="M9 2h6M12 8v8M8 12h8" />
            </svg>
          </span>

          <span>
            <span className="block text-base font-bold leading-tight text-sky-950">
              Recordatorio Salud
            </span>
            <span className="block text-xs text-sky-700">
              Gestión terapéutica segura
            </span>
          </span>
        </Link>

        {/* Enlaces informativos solo para visitantes */}
        {!user && (
          <div className="hidden items-center gap-7 md:flex">
            <Link
              to="/home#caracteristicas"
              onClick={cerrarMenus}
              className="text-sm font-medium text-slate-700 hover:text-sky-800"
            >
              Características
            </Link>
            <Link
              to="/home#para-quien"
              onClick={cerrarMenus}
              className="text-sm font-medium text-slate-700 hover:text-sky-800"
            >
              ¿Para quién es?
            </Link>
            <Link
              to="/home#beneficios"
              onClick={cerrarMenus}
              className="text-sm font-medium text-slate-700 hover:text-sky-800"
            >
              Beneficios
            </Link>
            <Link
              to="/home#privacidad"
              onClick={cerrarMenus}
              className="text-sm font-medium text-slate-700 hover:text-sky-800"
            >
              Privacidad
            </Link>
          </div>
        )}

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuUsuarioAbierto((abierto) => !abierto)}
                aria-label="Abrir menú de usuario"
                aria-expanded={menuUsuarioAbierto}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-950 text-white transition hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <circle cx="12" cy="8" r="3" />
                  <path d="M5 20a7 7 0 0 1 14 0" />
                </svg>
              </button>

              {menuUsuarioAbierto && (
                <div className="absolute right-0 mt-3 w-72 rounded-xl border border-slate-100 bg-white p-4 shadow-xl">
                  <p className="truncate font-semibold text-slate-900">
                    {user.nombre}
                  </p>
                  <p className="mt-1 truncate text-sm text-slate-600">
                    {user.correo}
                  </p>

                  <div className="my-3 border-t border-slate-100" />

                  <Link
                    to="/perfil"
                    onClick={cerrarMenus}
                    className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-sky-50"
                  >
                    Mi perfil
                  </Link>
                  <Link
                    to="/perfil/editar"
                    onClick={cerrarMenus}
                    className="mt-1 block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-sky-50"
                  >
                    Editar perfil
                  </Link>
                  <button
                    type="button"
                    onClick={cerrarSesion}
                    className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-700 hover:bg-red-50"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-2 text-sm font-medium text-sky-900 hover:text-sky-700"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-sky-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-800"
              >
                Crear cuenta / Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Botón para abrir/cerrar la navegación móvil */}
        <button
          type="button"
          onClick={() => setMenuMovilAbierto((abierto) => !abierto)}
          aria-label={menuMovilAbierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuMovilAbierto}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-sky-950 hover:bg-sky-50 md:hidden"
        >
          {menuMovilAbierto ? (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6"
            >
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Menú móvil */}
      {menuMovilAbierto && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-lg md:hidden">
          {user ? (
            <>
              <div className="mb-3 rounded-xl bg-sky-50 p-3">
                <p className="font-semibold text-slate-900">{user.nombre}</p>
                <p className="truncate text-sm text-slate-600">{user.correo}</p>
              </div>

              <Link
                to="/perfil"
                onClick={cerrarMenus}
                className="block rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-sky-50"
              >
                Mi perfil
              </Link>
              <Link
                to="/perfil/editar"
                onClick={cerrarMenus}
                className="block rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-sky-50"
              >
                Editar perfil
              </Link>
              <button
                type="button"
                onClick={cerrarSesion}
                className="mt-1 w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-700 hover:bg-red-50"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/home#caracteristicas"
                onClick={cerrarMenus}
                className="block rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-sky-50"
              >
                Características
              </Link>
              <Link
                to="/home#para-quien"
                onClick={cerrarMenus}
                className="block rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-sky-50"
              >
                ¿Para quién es?
              </Link>
              <Link
                to="/home#beneficios"
                onClick={cerrarMenus}
                className="block rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-sky-50"
              >
                Beneficios
              </Link>
              <Link
                to="/home#privacidad"
                onClick={cerrarMenus}
                className="block rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-sky-50"
              >
                Privacidad
              </Link>

              <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3">
                <Link
                  to="/login"
                  onClick={cerrarMenus}
                  className="rounded-xl px-4 py-2.5 text-center text-sm font-medium text-sky-900 hover:bg-sky-50"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  onClick={cerrarMenus}
                  className="rounded-xl bg-sky-900 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-sky-800"
                >
                  Crear cuenta / Registrarse
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}
