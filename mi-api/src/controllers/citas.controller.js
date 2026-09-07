let citas = [
    {
    id: 1,
    usuario_id: 1,
    nombre: 'cita1 ',
    descripcion: '21322',
    fecha: "26/09/2026",
    estado: "Pendiente"
    },

    {
    id: 2,
    usuario_id: 1,
    nombre: 'cita2',
    descripcion: '32345',
    fecha: "14/09/2026",
    estado: "Pendiente"
    },
    {
    id: 3,
    usuario_id: 2,
    nombre: 'cita3',
    descripcion: '32345',
    fecha: "15/10/2026",
    estado: "Pendiente"
    }

];

const getAll = (req, res) => {

  const usuarioId = req.params.usuarioId;

  const resultado = citas.filter(
    t => t.usuario_id == usuarioId
  );

  res.json({
    ok: true,
    data: resultado
  });
};

const getById = (req, res) => {
  const item = citas.find(
    t => t.id == req.params.id
  );
  if (!item) return res.status(404)
    .json({ ok: false, msg: 'No encontrado' });
  res.json({ ok: true, data: item });
};

const create = (req, res) => {
  const nuevo = { id: Date.now(), ...req.body };
  citas.push(nuevo);
  res.status(201).json({ ok: true, data: nuevo });
};
module.exports = { getAll, getById, create };