import { useState } from 'react';
import { Link } from 'react-router-dom';
import { predecirIntencion } from '../services/agente';
import { obtenerPacientes } from '../services/usuarioPaciente';
import { obtenerCitas, registrarCita } from '../services/citas';
import { obtenerTiposCita } from '../services/catalogos';

const nombresIntencion = {
    consultar_pacientes: 'consultar pacientes',
    consultar_citas: 'consultar citas',
    programar_cita: 'programar una cita',
    fuera_de_alcance: 'una solicitud fuera de las funciones disponibles',
    pedir_opcion_del_menu: 'una solicitud que necesita aclaración',
};

const normalizarTexto = (valor) =>
    valor
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLocaleLowerCase('es-CO');

const ordenarPorNombre = (elementos, obtenerNombre) =>
    [...elementos].sort((a, b) =>
        obtenerNombre(a).localeCompare(obtenerNombre(b), 'es', { sensitivity: 'base' })
    );

const buscarSeleccion = (texto, elementos, obtenerNombre) => {
    const entrada = normalizarTexto(texto);

    if (/^\d+$/.test(entrada)) {
        const indice = Number(entrada) - 1;
        return elementos[indice] ? { elemento: elementos[indice] } : { noEncontrado: true };
    }

    const coincidencias = elementos.filter(
        (elemento) => normalizarTexto(obtenerNombre(elemento)) === entrada
    );

    if (coincidencias.length === 1) return { elemento: coincidencias[0] };
    if (coincidencias.length > 1) return { ambiguo: true };
    return { noEncontrado: true };
};

const listarPacientes = (pacientes) =>
    pacientes
        .map((vinculacion, indice) => `${indice + 1}. ${vinculacion.paciente.nombre}`)
        .join('\n');

const listarTiposCita = (tipos) =>
    tipos.map((tipo, indice) => `${indice + 1}. ${tipo.nombre}`).join('\n');

const formatearFechaHora = (valor) => {
    const fecha = new Date(valor);
    if (Number.isNaN(fecha.getTime())) return String(valor);

    return fecha.toLocaleString('es-CO', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'America/Bogota',
    });
};

const convertirFechaIngresada = (texto) => {
    const coincidencia = texto.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})$/);
    if (!coincidencia) return null;

    const [, diaTexto, mesTexto, anioTexto, horaTexto, minutoTexto] = coincidencia;
    const dia = Number(diaTexto);
    const mes = Number(mesTexto);
    const anio = Number(anioTexto);
    const hora = Number(horaTexto);
    const minuto = Number(minutoTexto);
    const fecha = new Date(anio, mes - 1, dia, hora, minuto);

    const fechaValida =
        fecha.getFullYear() === anio &&
        fecha.getMonth() === mes - 1 &&
        fecha.getDate() === dia &&
        fecha.getHours() === hora &&
        fecha.getMinutes() === minuto;

    if (!fechaValida || fecha <= new Date()) return null;

    const dosDigitos = (numero) => String(numero).padStart(2, '0');
    return `${anio}-${dosDigitos(mes)}-${dosDigitos(dia)} ${dosDigitos(hora)}:${dosDigitos(minuto)}:00`;
};

const esConfirmacion = (texto) =>
    /^(si|confirmo|confirmar|de acuerdo|listo|dale|correcto|ok|okay|claro|de una)$/.test(
        normalizarTexto(texto)
    );

const esNegacion = (texto) =>
    /^(no|cancelar|cancele|mejor no|nop)$/.test(normalizarTexto(texto));

export default function Chat() {
    const [texto, setTexto] = useState('');
    const [mensajes, setMensajes] = useState([
        {
            autor: 'agente',
            texto: 'Hola. Puedo ayudarte con consultas de pacientes y citas. ¿Qué necesitas?',
        },
    ]);
    const [enviando, setEnviando] = useState(false);
    const [flujoCita, setFlujoCita] = useState(null);

    const enviarMensaje = async (evento) => {
        evento.preventDefault();

        const textoEnviado = texto.trim();
        if (!textoEnviado || enviando) return;

        setMensajes((anteriores) => [
            ...anteriores,
            { autor: 'usuario', texto: textoEnviado },
        ]);
        setTexto('');
        setEnviando(true);

        try {
            let respuesta;
            let resultado;

            if (flujoCita) {
                const entrada = normalizarTexto(textoEnviado);

                if (entrada === 'cancelar' || entrada === 'cancele') {
                    setFlujoCita(null);
                    respuesta = 'Listo, cancelé la programación de la cita.';
                } else if (flujoCita.paso === 'seleccionar_paciente') {
                    const seleccion = buscarSeleccion(
                        textoEnviado,
                        flujoCita.pacientes,
                        (vinculacion) => vinculacion.paciente.nombre
                    );

                    if (!seleccion.elemento) {
                        respuesta = seleccion.ambiguo
                            ? `Hay varios pacientes con ese nombre. Elige usando el número:\n${listarPacientes(flujoCita.pacientes)}`
                            : `No encontré ese paciente. Escribe su número o su nombre exacto:\n${listarPacientes(flujoCita.pacientes)}`;
                    } else {
                        const paciente = seleccion.elemento.paciente;
                        const respuestaTipos = await obtenerTiposCita();
                        const tipos = ordenarPorNombre(
                            respuestaTipos.data ?? [],
                            (tipo) => tipo.nombre
                        );

                        if (tipos.length === 0) {
                            setFlujoCita(null);
                            respuesta = 'No hay tipos de cita disponibles para registrar una cita.';
                        } else {
                            setFlujoCita({
                                paso: 'seleccionar_tipo',
                                paciente,
                                tipos,
                            });
                            respuesta = `Paciente seleccionado: ${paciente.nombre}. ¿Qué tipo de cita necesitas? Escribe el número o el nombre exacto:\n${listarTiposCita(tipos)}`;
                        }
                    }
                } else if (flujoCita.paso === 'seleccionar_tipo') {
                    const seleccion = buscarSeleccion(
                        textoEnviado,
                        flujoCita.tipos,
                        (tipo) => tipo.nombre
                    );

                    if (!seleccion.elemento) {
                        respuesta = seleccion.ambiguo
                            ? `Hay varios tipos con ese nombre. Elige usando el número:\n${listarTiposCita(flujoCita.tipos)}`
                            : `No encontré ese tipo de cita. Escribe su número o su nombre exacto:\n${listarTiposCita(flujoCita.tipos)}`;
                    } else {
                        setFlujoCita({
                            paso: 'ingresar_fecha',
                            paciente: flujoCita.paciente,
                            tipo: seleccion.elemento,
                        });
                        respuesta = '¿Qué fecha y hora quieres? Escríbela como DD/MM/AAAA HH:mm, por ejemplo: 25/12/2026 09:30.';
                    }
                } else if (flujoCita.paso === 'ingresar_fecha') {
                    const fechaHora = convertirFechaIngresada(textoEnviado);

                    if (!fechaHora) {
                        respuesta = 'La fecha no es válida o ya pasó. Usa DD/MM/AAAA HH:mm y escribe una fecha futura, por ejemplo: 25/12/2026 09:30.';
                    } else {
                        setFlujoCita({
                            paso: 'confirmar',
                            paciente: flujoCita.paciente,
                            tipo: flujoCita.tipo,
                            fechaHora,
                        });
                        respuesta = `Confirma la cita:\nPaciente: ${flujoCita.paciente.nombre}\nTipo: ${flujoCita.tipo.nombre}\nFecha y hora: ${formatearFechaHora(fechaHora)}\n\nEscribe “sí” para registrarla o “no” para cancelarla.`;
                    }
                } else if (flujoCita.paso === 'confirmar') {
                    if (esConfirmacion(textoEnviado)) {
                        await registrarCita(flujoCita.paciente.id, {
                            tipo_cita_id: flujoCita.tipo.id,
                            fecha_hora: flujoCita.fechaHora,
                            descripcion: null,
                        });
                        setFlujoCita(null);
                        respuesta = `Cita registrada para ${flujoCita.paciente.nombre}: ${flujoCita.tipo.nombre}, ${formatearFechaHora(flujoCita.fechaHora)}.`;
                    } else if (esNegacion(textoEnviado)) {
                        setFlujoCita(null);
                        respuesta = 'Listo, no registré la cita.';
                    } else {
                        respuesta = 'Para continuar, responde “sí” para registrar la cita o “no” para cancelarla.';
                    }
                }
            } else {
                resultado = await predecirIntencion(textoEnviado);
                const nombre = nombresIntencion[resultado.intencion] ?? resultado.intencion;

                if (resultado.requiere_menu) {
                    respuesta = 'No entendí con suficiente claridad. Prueba preguntando por pacientes, citas o cómo programar una cita.';
                } else if (resultado.intencion === 'consultar_pacientes') {
                    const vinculaciones = await obtenerPacientes();
                    const pacientes = ordenarPorNombre(
                        vinculaciones.data ?? [],
                        (vinculacion) => vinculacion.paciente.nombre
                    );

                    respuesta = pacientes.length === 0
                        ? 'Todavía no tienes pacientes vinculados.'
                        : `Pacientes vinculados (${pacientes.length}):\n${listarPacientes(pacientes)}`;
                } else if (resultado.intencion === 'consultar_citas') {
                    const vinculaciones = await obtenerPacientes();
                    const pacientes = ordenarPorNombre(
                        vinculaciones.data ?? [],
                        (vinculacion) => vinculacion.paciente.nombre
                    );

                    if (pacientes.length === 0) {
                        respuesta = 'Todavía no tienes pacientes vinculados.';
                    } else {
                        const grupos = await Promise.all(
                            pacientes.map(async (vinculacion) => {
                                const paciente = vinculacion.paciente;
                                const respuestaCitas = await obtenerCitas(paciente.id);
                                const citas = [...(respuestaCitas.data ?? [])].sort(
                                    (a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora)
                                );

                                if (citas.length === 0) {
                                    return `${paciente.nombre}\n   No tiene citas registradas.`;
                                }

                                const detalle = citas.map((cita, indice) => {
                                    const tipo = cita.tipo_cita?.nombre ?? 'Cita médica';
                                    const fecha = formatearFechaHora(cita.fecha_hora);
                                    return `   ${indice + 1}. ${tipo}: ${fecha} (${cita.estado ?? 'sin estado'})`;
                                });

                                return `${paciente.nombre}\n${detalle.join('\n')}`;
                            })
                        );

                        respuesta = `Citas por paciente, ordenadas por fecha:\n\n${grupos.join('\n\n')}`;
                    }
                } else if (resultado.intencion === 'programar_cita') {
                    const vinculaciones = await obtenerPacientes();
                    const pacientes = ordenarPorNombre(
                        vinculaciones.data ?? [],
                        (vinculacion) => vinculacion.paciente.nombre
                    );

                    if (pacientes.length === 0) {
                        respuesta = 'Todavía no tienes pacientes vinculados para programarles una cita.';
                    } else {
                        setFlujoCita({
                            paso: 'seleccionar_paciente',
                            pacientes,
                        });
                        respuesta = `¿Para cuál paciente quieres programar la cita? Escribe el número o su nombre exacto:\n${listarPacientes(pacientes)}`;
                    }
                } else {
                    respuesta = `Entendí que quieres ${nombre}. Puedo consultar pacientes y citas, o ayudarte a programar una cita.`;
                }
            }

            setMensajes((anteriores) => [
                ...anteriores,
                {
                    autor: 'agente',
                    texto: respuesta,
                    ...(resultado && {
                        intencion: resultado.intencion,
                        confianza: resultado.confianza,
                    }),
                },
            ]);
        } catch (error) {
            setMensajes((anteriores) => [
                ...anteriores,
                {
                    autor: 'agente',
                    texto:
                        error.response?.data?.mensaje ??
                        error.response?.data?.msg ??
                        'No pude completar la solicitud. Revisa la conexión e inténtalo de nuevo.',
                },
            ]);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 px-4 py-8 sm:px-6">
            <section
                translate="no"
                className="mx-auto flex min-h-[70vh] max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-sky-100"
            >
                <header className="flex flex-wrap items-center justify-between gap-4 bg-cyan-950 px-6 py-5 text-white">
                    <div>
                        <h1 className="text-2xl font-bold">Asistente de salud</h1>
                        <p className="mt-1 text-sm text-cyan-100">
                            Cuéntame qué necesitas consultar.
                        </p>
                    </div>
                    <Link
                        to="/perfil"
                        className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-cyan-700 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-900 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                    >
                        <span aria-hidden="true">←</span>
                        Volver a pacientes
                    </Link>
                </header>

                <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
                    {mensajes.map((mensaje, indice) => (
                        <div
                            key={`${mensaje.autor}-${indice}`}
                            className={`flex ${mensaje.autor === 'usuario' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] rounded-2xl px-4 py-3 ${mensaje.autor === 'usuario'
                                    ? 'bg-cyan-900 text-white'
                                    : 'bg-sky-50 text-slate-800'
                                    }`}
                            >
                                <p className="whitespace-pre-line">{mensaje.texto}</p>

                                {mensaje.intencion && (
                                    <p className="mt-2 text-xs opacity-75">
                                        Intención: {mensaje.intencion}
                                        {typeof mensaje.confianza === 'number' &&
                                            ` · Confianza: ${Math.round(mensaje.confianza * 100)}%`}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}

                    {enviando && (
                        <p className="text-sm text-slate-500" role="status">
                            El agente está revisando tu mensaje…
                        </p>
                    )}
                </div>

                <form onSubmit={enviarMensaje} className="border-t border-sky-100 p-4 sm:p-5">
                    <label htmlFor="mensaje-chat" className="sr-only">
                        Escribe tu mensaje
                    </label>
                    <div className="flex gap-3">
                        <input
                            id="mensaje-chat"
                            value={texto}
                            onChange={(evento) => setTexto(evento.target.value)}
                            placeholder="Escribe un mensaje…"
                            className="min-w-0 flex-1 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                            disabled={enviando}
                        />
                        <button
                            type="submit"
                            disabled={enviando || !texto.trim()}
                            className="rounded-xl bg-cyan-900 px-5 py-3 font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Enviar
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}
