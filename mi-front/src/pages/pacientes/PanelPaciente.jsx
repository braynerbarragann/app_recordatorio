import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { obtenerPaciente } from '../../services/usuarioPaciente';
import { obtenerCitas } from '../../services/citas';
import { obtenerMedicamentosTratamiento, obtenerTratamientos } from '../../services/tratamientos';
import { obtenerTomasMedicamentos } from '../../services/tomasMedicamento';

// MySQL guarda estos valores como DATETIME sin zona horaria. Se interpretan
// como hora local para que la pantalla no desplace las horas al mostrarlas.
const convertirAFechaLocal = (valor) => {
    if (!valor) return null;

    const coincidencia = String(valor).match(
        /^(\d{4})-(\d{2})-(\d{2})(?:T| )(\d{2}):(\d{2})(?::(\d{2}))?/
    );

    if (!coincidencia) return null;

    const [, anio, mes, dia, hora = '0', minuto = '0', segundo = '0'] = coincidencia;
    const fecha = new Date(
        Number(anio), Number(mes) - 1, Number(dia), Number(hora), Number(minuto), Number(segundo)
    );

    return Number.isNaN(fecha.getTime()) ? null : fecha;
};

const formatoFecha = new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});

const formatoHora = new Intl.DateTimeFormat('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
});

const mostrarFecha = (valor) => {
    const fecha = convertirAFechaLocal(valor);
    return fecha ? formatoFecha.format(fecha) : 'Fecha por confirmar';
};

const mostrarFechaHora = (valor) => {
    const fecha = convertirAFechaLocal(valor);
    return fecha
        ? `${formatoFecha.format(fecha)} · ${formatoHora.format(fecha)}`
        : 'Fecha por confirmar';
};

const calcularEdad = (fechaNacimiento) => {
    const nacimiento = convertirAFechaLocal(fechaNacimiento);
    if (!nacimiento) return null;

    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const aunNoCumple =
        hoy.getMonth() < nacimiento.getMonth() ||
        (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate());

    if (aunNoCumple) edad -= 1;
    return edad >= 0 ? edad : null;
};

const claseEstado = (estado) => {
    if (estado === 'CONFIRMADA' || estado === 'TOMADA') {
        return 'bg-emerald-100 text-emerald-800';
    }
    if (estado === 'CANCELADA' || estado === 'OMITIDA' || estado === 'VENCIDA' || estado === 'NO_ASISTIO') {
        return 'bg-rose-100 text-rose-700';
    }
    return 'bg-sky-100 text-sky-800';
};

export default function PanelPaciente() {
    const { pacienteId } = useParams();
    const [paciente, setPaciente] = useState(null);
    const [citas, setCitas] = useState([]);
    const [tratamientos, setTratamientos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [mostrarTodasTomas, setMostrarTodasTomas] = useState(false);

    useEffect(() => {
        let sigueActivo = true;

        const cargarPanel = async () => {
            try {
                setCargando(true);
                setError('');

                const [respuestaPaciente, respuestaCitas, respuestaTratamientos] = await Promise.all([
                    obtenerPaciente(pacienteId),
                    obtenerCitas(pacienteId),
                    obtenerTratamientos(pacienteId),
                ]);

                const pacienteCargado = respuestaPaciente.data;
                const citasCargadas = respuestaCitas.data ?? [];
                const listaTratamientos = respuestaTratamientos.data ?? [];

                const tratamientosCargados = await Promise.all(
                    listaTratamientos.map(async (tratamiento) => {
                        const respuestaMedicamentos = await obtenerMedicamentosTratamiento(
                            pacienteId,
                            tratamiento.id
                        );
                        const listaMedicamentos = respuestaMedicamentos.data ?? [];

                        const medicamentos = await Promise.all(
                            listaMedicamentos.map(async (tratamientoMedicamento) => {
                                const respuestaTomas = await obtenerTomasMedicamentos(
                                    pacienteId,
                                    tratamiento.id,
                                    tratamientoMedicamento.id
                                );

                                return {
                                    ...tratamientoMedicamento,
                                    tomas: respuestaTomas.data ?? [],
                                };
                            })
                        );

                        return { ...tratamiento, medicamentos };
                    })
                );

                if (sigueActivo) {
                    setPaciente(pacienteCargado);
                    setCitas(citasCargadas);
                    setTratamientos(tratamientosCargados);
                }
            } catch (err) {
                if (sigueActivo) {
                    setError(
                        err.response?.data?.msg ||
                        err.response?.data?.mensaje ||
                        'No fue posible cargar la información del paciente.'
                    );
                }
            } finally {
                if (sigueActivo) setCargando(false);
            }
        };

        cargarPanel();
        return () => {
            sigueActivo = false;
        };
    }, [pacienteId]);

    const citasOrdenadas = useMemo(
        () => [...citas].sort((a, b) => {
            const fechaA = convertirAFechaLocal(a.fecha_hora)?.getTime() ?? 0;
            const fechaB = convertirAFechaLocal(b.fecha_hora)?.getTime() ?? 0;
            return fechaA - fechaB;
        }),
        [citas]
    );

    const medicamentosConTomas = useMemo(
        () => tratamientos.flatMap((tratamiento) =>
            (tratamiento.medicamentos ?? []).map((medicamento) => ({
                ...medicamento,
                tratamientoNombre: tratamiento.nombre,
                tomas: [...(medicamento.tomas ?? [])].sort((a, b) => {
                    const fechaA = convertirAFechaLocal(a.fecha_hora_programada)?.getTime() ?? 0;
                    const fechaB = convertirAFechaLocal(b.fecha_hora_programada)?.getTime() ?? 0;
                    return fechaA - fechaB;
                }),
            }))
        ),
        [tratamientos]
    );

    const todasLasTomas = useMemo(
        () => medicamentosConTomas.flatMap((medicamento) =>
            medicamento.tomas.map((toma) => ({ ...toma, medicamentoNombre: medicamento.medicamento?.nombre }))
        ).sort((a, b) => {
            const fechaA = convertirAFechaLocal(a.fecha_hora_programada)?.getTime() ?? 0;
            const fechaB = convertirAFechaLocal(b.fecha_hora_programada)?.getTime() ?? 0;
            return fechaA - fechaB;
        }),
        [medicamentosConTomas]
    );

    const ahora = new Date();
    const tomasPendientes = todasLasTomas.filter((toma) => toma.estado === 'PENDIENTE');
    const proximaToma = tomasPendientes.find((toma) => {
        const fecha = convertirAFechaLocal(toma.fecha_hora_programada);
        return fecha && fecha >= ahora;
    });
    const tomasPendientesHoy = tomasPendientes.filter((toma) => {
        const fecha = convertirAFechaLocal(toma.fecha_hora_programada);
        return fecha && fecha.toDateString() === ahora.toDateString();
    }).length;
    const proximaCita = citasOrdenadas.find(
        (cita) => !['CANCELADA', 'REALIZADA', 'NO_ASISTIO'].includes(cita.estado)
    );
    const tratamientosConMedicamentos = tratamientos.filter(
        (tratamiento) => tratamiento.medicamentos?.length > 0
    ).length;
    const edad = calcularEdad(paciente?.fecha_nacimiento);

    if (cargando) {
        return (
            <main className="min-h-screen bg-transparent px-4 py-10 text-slate-700 sm:px-6">
                <div className="mx-auto max-w-7xl rounded-2xl bg-white p-8 text-center shadow-sm" role="status">
                    Cargando la ficha del paciente...
                </div>
            </main>
        );
    }

    if (error || !paciente) {
        return (
            <main className="min-h-screen bg-transparent px-4 py-10 sm:px-6">
                <div className="mx-auto max-w-3xl rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-800" role="alert">
                    {error || 'No se encontró el paciente.'}
                    <div className="mt-4">
                        <Link to="/perfil" className="font-semibold underline">Volver a pacientes</Link>
                    </div>
                </div>
            </main>
        );
    }

    const estadoPaciente = paciente.estado === 'ACTIVO';

    return (
        <main className="min-h-screen bg-transparent px-4 py-6 text-slate-800 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-5">
                <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-800">
                            <span className="inline-flex items-center gap-2">
                                <span className="material-symbols-outlined notranslate text-base" translate="no" aria-hidden="true">article_person</span>
                                Ficha general del paciente
                            </span>
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                            <Link
                                to="/perfil"
                                className="inline-flex items-center justify-center rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-900 transition hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800"
                            >
                                ← Volver a pacientes
                            </Link>
                            <div className={`rounded-full px-4 py-2 text-xs font-bold text-white ${estadoPaciente ? 'bg-sky-900' : 'bg-slate-500'}`}>
                                <span className={`mr-2 inline-block h-2 w-2 rounded-full ${estadoPaciente ? 'bg-emerald-300' : 'bg-slate-300'}`} />
                                {estadoPaciente ? 'PACIENTE ACTIVO' : 'PACIENTE INACTIVO'}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 md:flex-row md:items-center">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-2xl font-bold text-sky-800" aria-hidden="true">
                            {paciente.nombre?.trim()?.charAt(0)?.toLocaleUpperCase('es-CO') || '?'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-2xl font-bold text-sky-950 sm:text-3xl">{paciente.nombre}</h1>
                                {edad !== null && (
                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                                        {edad} {edad === 1 ? 'año' : 'años'}
                                    </span>
                                )}
                            </div>
                            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-600">
                                <p>{paciente.tipo_documento?.nombre || 'Documento'}: <strong className="text-slate-800">{paciente.numero_documento}</strong></p>
                                <p>Género: {paciente.genero?.nombre || 'No especificado'}</p>
                                <p>ID del paciente: {paciente.id}</p>
                            </div>
                        </div>
                        <Link
                            to={`/pacientes/${paciente.id}/editar`}
                            className="inline-flex items-center justify-center rounded-xl border border-sky-200 px-4 py-2 text-sm font-semibold text-sky-900 transition hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800"
                        >
                            Editar datos
                        </Link>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl bg-sky-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-sky-800">Dirección</p>
                            <p className="mt-2 text-sm text-slate-700">{paciente.direccion || 'No registrada'}</p>
                        </div>
                        <div className="rounded-2xl bg-sky-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-sky-800">Tratamientos con medicamentos</p>
                            <p className="mt-2 text-sm text-slate-700">
                                {tratamientosConMedicamentos} {tratamientosConMedicamentos === 1 ? 'plan asociado' : 'planes asociados'}
                            </p>
                        </div>
                    </div>
                </section>

                <section aria-label="Resumen del paciente" className="grid gap-4 md:grid-cols-3">
                    <article className="rounded-2xl border-t-4 border-sky-700 bg-white p-5 shadow-sm">
                        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-sky-800">
                            <span className="material-symbols-outlined notranslate text-base" translate="no" aria-hidden="true">alarm</span>
                            Próxima toma
                        </p>
                        {proximaToma ? (
                            <>
                                <h2 className="mt-3 font-semibold text-slate-900">{proximaToma.medicamentoNombre || 'Medicamento'}</h2>
                                <p className="mt-1 text-sm text-slate-600">{mostrarFechaHora(proximaToma.fecha_hora_programada)}</p>
                                <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${claseEstado(proximaToma.estado)}`}>
                                    {proximaToma.estado}
                                </span>
                            </>
                        ) : <p className="mt-3 text-sm text-slate-500">No hay tomas futuras pendientes.</p>}
                        <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                            {tomasPendientesHoy} {tomasPendientesHoy === 1 ? 'toma pendiente' : 'tomas pendientes'} para hoy
                        </p>
                    </article>

                    <article className="rounded-2xl border-t-4 border-cyan-800 bg-white p-5 shadow-sm">
                        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-cyan-900">
                            <span className="material-symbols-outlined notranslate text-base" translate="no" aria-hidden="true">calendar_clock</span>
                            Próxima cita
                        </p>
                        {proximaCita ? (
                            <>
                                <h2 className="mt-3 font-semibold text-slate-900">{proximaCita.tipo_cita?.nombre || 'Cita médica'}</h2>
                                <p className="mt-1 text-sm text-slate-600">{mostrarFechaHora(proximaCita.fecha_hora)}</p>
                                <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${claseEstado(proximaCita.estado)}`}>
                                    {proximaCita.estado}
                                </span>
                            </>
                        ) : <p className="mt-3 text-sm text-slate-500">No hay citas próximas registradas.</p>}
                    </article>

                    <article className="rounded-2xl border-t-4 border-emerald-700 bg-white p-5 shadow-sm">
                        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-800">
                            <span className="material-symbols-outlined notranslate text-base" translate="no" aria-hidden="true">diagnosis</span>
                            Tratamientos
                        </p>
                        <p className="mt-3 text-3xl font-bold text-sky-950">{tratamientos.length}</p>
                        <p className="mt-1 text-sm text-slate-600">
                            {tratamientos.length === 1 ? 'tratamiento registrado' : 'tratamientos registrados'}
                        </p>
                        <p className="mt-3 text-xs text-slate-500">{medicamentosConTomas.length} asociaciones con medicamentos</p>
                    </article>
                </section>

                <nav aria-label="Ir a una sección del panel" className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
                    <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Ir a:</span>
                    {[
                        ['#tomas', 'alarm', 'Tomas de medicamentos'],
                        ['#citas', 'calendar_clock', 'Citas médicas'],
                        ['#tratamientos', 'diagnosis', 'Tratamientos'],
                    ].map(([destino, icono, texto]) => (
                        <a key={destino} href={destino} className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-900 transition hover:bg-sky-100">
                            <span className="material-symbols-outlined notranslate text-base" translate="no" aria-hidden="true">{icono}</span>
                            {texto}
                        </a>
                    ))}
                </nav>

                <div className="grid items-start gap-5 lg:grid-cols-2">
                    <section id="tomas" className="scroll-mt-24 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                        <div className="mb-5 flex items-start gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-800" aria-hidden="true">
                                <span className="material-symbols-outlined notranslate text-2xl" translate="no">alarm</span>
                            </span>
                            <div>
                                <h2 className="text-xl font-bold text-sky-950">Tomas de medicamentos</h2>
                                <p className="text-sm text-slate-600">Horarios y estado de las tomas programadas.</p>
                            </div>
                        </div>

                        {medicamentosConTomas.length === 0 ? (
                            <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No hay tomas de medicamentos registradas.</p>
                        ) : (
                            <>
                                <div className="rounded-2xl bg-sky-50 p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-sky-800">Resumen de hoy</p>
                                        <p className="mt-1 text-sm text-slate-700">
                                            {tomasPendientesHoy
                                                ? `Hay ${tomasPendientesHoy} ${tomasPendientesHoy === 1 ? 'toma pendiente' : 'tomas pendientes'} para hoy.`
                                                : 'No hay tomas pendientes programadas para hoy.'}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setMostrarTodasTomas((visible) => !visible)}
                                        aria-expanded={mostrarTodasTomas}
                                        aria-controls="detalle-tomas"
                                        className="mt-3 inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-sky-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-800 sm:mt-0"
                                    >
                                        {mostrarTodasTomas ? 'Ocultar tomas' : 'Ver todas las tomas'}
                                        <span aria-hidden="true">{mostrarTodasTomas ? '⌃' : '⌄'}</span>
                                    </button>
                                </div>

                                {mostrarTodasTomas && (
                                    <div id="detalle-tomas" className="mt-4 space-y-3">
                                        {medicamentosConTomas.map((medicamento) => (
                                            <article key={medicamento.id} className="rounded-xl border border-slate-100 p-4">
                                                <div className="flex flex-wrap items-start justify-between gap-2">
                                                    <div>
                                                        <h3 className="font-semibold text-slate-900">{medicamento.medicamento?.nombre || 'Medicamento'}</h3>
                                                        <p className="mt-1 text-xs text-slate-500">{medicamento.tratamientoNombre}</p>
                                                        <p className="mt-1 text-sm text-slate-600">
                                                            {medicamento.dosis} {medicamento.unidad_dosis}
                                                            {medicamento.tipo_frecuencia?.nombre ? ` · ${medicamento.tipo_frecuencia.nombre}` : ''}
                                                        </p>
                                                    </div>
                                                    <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-800">
                                                        {medicamento.tomas.length} {medicamento.tomas.length === 1 ? 'toma' : 'tomas'}
                                                    </span>
                                                </div>

                                                {medicamento.tomas.length === 0 ? (
                                                    <p className="mt-3 text-sm text-slate-500">No hay tomas programadas.</p>
                                                ) : (
                                                    <ul className="mt-3 space-y-2">
                                                        {medicamento.tomas.map((toma) => (
                                                            <li key={toma.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-sky-50 px-3 py-2 text-sm">
                                                                <span className="text-slate-700">{mostrarFechaHora(toma.fecha_hora_programada)}</span>
                                                                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${claseEstado(toma.estado)}`}>
                                                                    {toma.estado}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </article>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </section>

                    <section id="citas" className="scroll-mt-24 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                        <div className="mb-5 flex items-start gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-800" aria-hidden="true">
                                <span className="material-symbols-outlined notranslate text-2xl" translate="no">calendar_clock</span>
                            </span>
                            <div>
                                <h2 className="text-xl font-bold text-sky-950">Citas médicas</h2>
                                <p className="text-sm text-slate-600">Próximas citas y su estado.</p>
                            </div>
                        </div>

                        {citasOrdenadas.length === 0 ? (
                            <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Este paciente no tiene citas registradas.</p>
                        ) : (
                            <div className="space-y-3">
                                {citasOrdenadas.map((cita) => (
                                    <article key={cita.id} className="rounded-xl border-l-4 border-sky-700 bg-slate-50 p-4">
                                        <div className="flex flex-wrap items-start justify-between gap-2">
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wide text-sky-800">
                                                    {cita.tipo_cita?.nombre || 'Cita médica'}
                                                </p>
                                                <h3 className="mt-1 font-semibold text-slate-900">{mostrarFechaHora(cita.fecha_hora)}</h3>
                                            </div>
                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${claseEstado(cita.estado)}`}>
                                                {cita.estado}
                                            </span>
                                        </div>
                                        {cita.descripcion && <p className="mt-3 text-sm text-slate-600">{cita.descripcion}</p>}
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                <section id="tratamientos" className="scroll-mt-24 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-5 flex items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-800" aria-hidden="true">
                            <span className="material-symbols-outlined notranslate text-2xl" translate="no">diagnosis</span>
                        </span>
                        <div>
                            <h2 className="text-xl font-bold text-sky-950">Tratamientos</h2>
                            <p className="text-sm text-slate-600">Planes registrados y medicamentos asociados.</p>
                        </div>
                    </div>

                    {tratamientos.length === 0 ? (
                        <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Este paciente no tiene tratamientos registrados.</p>
                    ) : (
                        <div className="space-y-4">
                            {tratamientos.map((tratamiento) => (
                                <article key={tratamiento.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-cyan-800 bg-cyan-950 p-4 text-white sm:p-5">
                                        <div className="flex min-w-0 items-start gap-3">
                                            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-700 bg-cyan-900 text-cyan-200" aria-hidden="true">
                                                <span className="material-symbols-outlined text-[20px] leading-none" translate="no"
                                                    aria-hidden="true" >ecg_heart</span>
                                            </span>
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="font-semibold text-white">{tratamiento.nombre}</h3>
                                                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                                                        Plan registrado
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-xs leading-relaxed text-cyan-100">
                                                    {tratamiento.descripcion || 'Sin descripción registrada'}
                                                    <span className="mx-1.5 text-cyan-500" aria-hidden="true">·</span>
                                                    Diagnóstico: {tratamiento.diagnostico?.enfermedad?.nombre || 'No asociado'}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="shrink-0 rounded-full border border-cyan-700 bg-cyan-900 px-3 py-1.5 text-xs font-medium text-cyan-100">
                                            {tratamiento.medicamentos?.length ?? 0} {(tratamiento.medicamentos?.length ?? 0) === 1 ? 'medicamento' : 'medicamentos'}
                                        </span>
                                    </div>

                                    {!tratamiento.medicamentos?.length ? (
                                        <p className="mx-4 mb-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-500 sm:mx-5">Sin medicamentos asociados.</p>
                                    ) : (
                                        <div className="app-background border-t border-slate-100 p-3 sm:p-4">
                                            <div className="grid gap-3 xl:grid-cols-2">
                                                {tratamiento.medicamentos.map((medicamento) => (
                                                    <div key={medicamento.id} className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
                                                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-800" aria-hidden="true">
                                                            <span className="material-symbols-outlined text-[18px] leading-none" translate="no"
                                                                aria-hidden="true">pill</span>
                                                        </span>
                                                        <div className="min-w-0 flex-1">
                                                            <h4 className="font-semibold text-sky-950">{medicamento.medicamento?.nombre || 'Medicamento'}</h4>
                                                            <p className="mt-1 text-xs text-slate-600">
                                                                {medicamento.dosis} {medicamento.unidad_dosis}
                                                                {medicamento.tipo_frecuencia?.nombre ? ` · ${medicamento.tipo_frecuencia.nombre}` : ''}
                                                            </p>
                                                            {medicamento.instruccion && <p className="mt-1 text-xs text-slate-500">{medicamento.instruccion}</p>}
                                                        </div>
                                                        <span className="shrink-0 rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-semibold text-sky-800">
                                                            {medicamento.tomas?.length ?? 0} {(medicamento.tomas?.length ?? 0) === 1 ? 'toma' : 'tomas'}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
