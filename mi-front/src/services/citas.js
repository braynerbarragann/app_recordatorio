import api from '../api/axios';

export const obtenerCitas = (pacienteId) =>
  api.get(`/pacientes/${pacienteId}/citas`).then((respuesta) => respuesta.data);

export const registrarCita = (pacienteId, datos) =>
  api.post(`/pacientes/${pacienteId}/citas`, datos).then((respuesta) => respuesta.data);
