import api from '../api/axios';

export const obtenerPacientes = () =>
  api.get('/usuarios/me/pacientes').then((respuesta) => respuesta.data);

export const obtenerPaciente = (pacienteId) =>
  api.get(`/pacientes/${pacienteId}`).then((respuesta) => respuesta.data);

export const registrarPaciente = (datos) =>
  api.post('/pacientes', datos).then((respuesta) => respuesta.data);

export const actualizarPaciente = (pacienteId, datos) =>
  api.put(`/pacientes/${pacienteId}`, datos).then((respuesta) => respuesta.data);