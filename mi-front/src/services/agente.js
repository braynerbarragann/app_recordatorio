import api from '../api/axios';

export const predecirIntencion = (texto) =>
  api.post('/agente/intencion', { texto }).then((respuesta) => respuesta.data);