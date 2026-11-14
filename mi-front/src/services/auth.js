import api from '../api/axios';

export const registrar = (datos) =>
  api.post('/auth/create', {
    nombre: datos.name,
    correo: datos.email,
    telefono: datos.phone,
    contrasena: datos.password
  }).then((respuesta) => respuesta.data);

export const iniciarSesion = (correo, contrasena) =>
  api.post('/auth/login', { correo, contrasena }).then((respuesta) => respuesta.data);

export const obtenerPerfil = () =>
  api.get('/usuarios/me').then((respuesta) => respuesta.data);



export const actualizarPerfil = (datos) =>
  api.put('/usuarios/me', {
    nombre: datos.nombre,
    correo: datos.correo,
    telefono: datos.telefono ?? null
  }).then((respuesta) => respuesta.data);
