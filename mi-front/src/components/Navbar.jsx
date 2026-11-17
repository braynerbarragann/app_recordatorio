import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

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
    <header className="relative z-20 border-b border-cyan-800 bg-cyan-950 text-white shadow-sm">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
        aria-label="Navegación principal"
      >
        <Link
          to={user ? '/perfil' : '/home'}
          onClick={cerrarMenus}
          className="flex shrink-0 items-center gap-3"
        >
          <img src={logo} alt="" aria-hidden="true" className="h-10 w-10 shrink-0 object-contain" />

          <span>
            <span className="block text-base font-bold leading-tight text-white">
              App Recordatorio
            </span>
            <span className="block text-xs text-cyan-300">
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
              className="text-sm font-medium text-cyan-100 transition hover:text-white"
            >
              Características
            </Link>
            <Link
              to="/home#para-quien"
              onClick={cerrarMenus}
              className="text-sm font-medium text-cyan-100 transition hover:text-white"
            >
              ¿Para quién es?
            </Link>
            <Link
              to="/home#beneficios"
              onClick={cerrarMenus}
              className="text-sm font-medium text-cyan-100 transition hover:text-white"
            >
              Beneficios
            </Link>
            <Link
              to="/home#privacidad"
              onClick={cerrarMenus}
              className="text-sm font-medium text-cyan-100 transition hover:text-white"
            >
              Privacidad
            </Link>
          </div>
        )}

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/chat"
                onClick={cerrarMenus}
                aria-label="Abrir asistente de salud"
                title="Asistente de salud"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-cyan-700 bg-cyan-900 px-3 text-cyan-100 transition hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-cyan-950"
              >
                <span
                  className="material-symbols-outlined notranslate text-2xl"
                  translate="no"
                  aria-hidden="true"
                >
                  smart_toy
                </span>
                <span className="text-sm font-medium">Asistente Salud</span>
              </Link>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuUsuarioAbierto((abierto) => !abierto)}
                  aria-label="Abrir menú de usuario"
                  aria-expanded={menuUsuarioAbierto}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-700 bg-cyan-900 text-cyan-100 transition hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-cyan-950"
                >
                  <span
                    className="material-symbols-outlined notranslate text-2xl"
                    translate="no"
                    aria-hidden="true"
                  >
                    person
                  </span>
                </button>

                {menuUsuarioAbierto && (
                  <div className="absolute right-0 mt-3 w-72 rounded-xl border border-cyan-700 bg-cyan-950 p-4 text-white shadow-xl shadow-cyan-950/30">
                    <p className="truncate font-semibold text-white">
                      {user.nombre}
                    </p>
                    <p className="mt-1 truncate text-sm text-cyan-200">
                      {user.correo}
                    </p>

                    <div className="my-3 border-t border-cyan-800" />

                    <Link
                      to="/perfil"
                      onClick={cerrarMenus}
                      className="block rounded-lg px-3 py-2 text-sm text-cyan-100 transition hover:bg-cyan-900 hover:text-white"
                    >
                      Mi perfil
                    </Link>
                    <Link
                      to="/perfil/editar"
                      onClick={cerrarMenus}
                      className="mt-1 block rounded-lg px-3 py-2 text-sm text-cyan-100 transition hover:bg-cyan-900 hover:text-white"
                    >
                      Editar perfil
                    </Link>
                    <button
                      type="button"
                      onClick={cerrarSesion}
                      className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-300 transition hover:bg-rose-950/60"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-2 text-sm font-medium text-cyan-100 transition hover:text-white"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="rounded-xl border border-cyan-700 bg-cyan-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700"
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
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-cyan-100 transition hover:bg-cyan-900 hover:text-white md:hidden"
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
        <div className="border-t border-cyan-800 bg-cyan-950 px-4 py-4 text-white shadow-lg md:hidden">
          {user ? (
            <>
              <div className="mb-3 rounded-xl border border-cyan-800 bg-cyan-900/60 p-3">
                <p className="font-semibold text-white">{user.nombre}</p>
                <p className="truncate text-sm text-cyan-200">{user.correo}</p>
              </div>

              <Link
                to="/chat"
                onClick={cerrarMenus}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-cyan-100 transition hover:bg-cyan-900 hover:text-white"
              >
                <span
                  className="material-symbols-outlined notranslate text-xl"
                  translate="no"
                  aria-hidden="true"
                >
                  smart_toy
                </span>
                Asistente de salud
              </Link>

              <Link
                to="/perfil"
                onClick={cerrarMenus}
                className="block rounded-lg px-3 py-2.5 text-sm text-cyan-100 transition hover:bg-cyan-900 hover:text-white"
              >
                Mi perfil
              </Link>
              <Link
                to="/perfil/editar"
                onClick={cerrarMenus}
                className="block rounded-lg px-3 py-2.5 text-sm text-cyan-100 transition hover:bg-cyan-900 hover:text-white"
              >
                Editar perfil
              </Link>
              <button
                type="button"
                onClick={cerrarSesion}
                className="mt-1 w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-rose-300 transition hover:bg-rose-950/60"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link
                to="/home#caracteristicas"
                onClick={cerrarMenus}
                className="block rounded-lg px-3 py-2.5 text-sm text-cyan-100 transition hover:bg-cyan-900 hover:text-white"
              >
                Características
              </Link>
              <Link
                to="/home#para-quien"
                onClick={cerrarMenus}
                className="block rounded-lg px-3 py-2.5 text-sm text-cyan-100 transition hover:bg-cyan-900 hover:text-white"
              >
                ¿Para quién es?
              </Link>
              <Link
                to="/home#beneficios"
                onClick={cerrarMenus}
                className="block rounded-lg px-3 py-2.5 text-sm text-cyan-100 transition hover:bg-cyan-900 hover:text-white"
              >
                Beneficios
              </Link>
              <Link
                to="/home#privacidad"
                onClick={cerrarMenus}
                className="block rounded-lg px-3 py-2.5 text-sm text-cyan-100 transition hover:bg-cyan-900 hover:text-white"
              >
                Privacidad
              </Link>

              <div className="mt-3 flex flex-col gap-2 border-t border-cyan-800 pt-3">
                <Link
                  to="/login"
                  onClick={cerrarMenus}
                  className="rounded-xl px-4 py-2.5 text-center text-sm font-medium text-cyan-100 transition hover:bg-cyan-900"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  onClick={cerrarMenus}
                  className="rounded-xl border border-cyan-700 bg-cyan-800 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-cyan-700"
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
