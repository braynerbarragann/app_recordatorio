import api from '../api/axios';

export const obtenerPacientes = () =>
  api.get('/usuarios/me/pacientes').then((respuesta) => respuesta.data);