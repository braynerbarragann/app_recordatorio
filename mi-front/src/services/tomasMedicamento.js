import api from '../api/axios';

export const obtenerTomasMedicamentos = (pacienteId, tratamientoId, tratamientoMedicamentoId) =>
  api.get(`/pacientes/${pacienteId}/tratamientos/${tratamientoId}/medicamentos/${tratamientoMedicamentoId}/tomas`).then((respuesta) => respuesta.data);