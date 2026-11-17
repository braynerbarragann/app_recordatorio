import api from '../api/axios';

export const obtenerTiposDocumento = () =>
  api.get('/tipos-documento').then((respuesta) => respuesta.data);

export const obtenerGeneros = () =>
  api.get('/generos').then((respuesta) => respuesta.data);

export const obtenerTiposRelacion = () =>
  api.get('/tipos-relacion').then((respuesta) => respuesta.data);

export const obtenerTiposCita = () =>
  api.get('/tipos-cita').then((respuesta) => respuesta.data);