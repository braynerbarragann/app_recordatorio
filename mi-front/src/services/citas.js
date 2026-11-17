import api from '../api/axios';

export const obtenerCitas = (pacienteId) =>
  api.get(`/pacientes/${pacienteId}/citas`).then((respuesta) => respuesta.data);