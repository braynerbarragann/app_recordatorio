import api from '../api/axios';

export const obtenerTratamientos = (pacienteId) =>
  api.get(`/pacientes/${pacienteId}/tratamientos`).then((respuesta) => respuesta.data);


export const obtenerMedicamentosTratamiento = (pacienteId, tratamientoId) =>
  api.get(`/pacientes/${pacienteId}/tratamientos/${tratamientoId}/medicamentos`).then((respuesta) => respuesta.data);

