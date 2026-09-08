let tratamientos = [
    {
    id: 1,
    usuario_id: 1,
    nombre: 'tratamiento1',
    descripcion: '21322'
    },

    {
    id: 2,
    usuario_id: 1,
    nombre: 'tratamiento2',
    descripcion: '32345'
    },
    {
    id: 3,
    usuario_id: 2,
    nombre: 'tratamiento3',
    descripcion: '32345'
    }

];

const getAll = (req, res) => {

  const usuarioId = req.params.usuarioId;

  const resultado = tratamientos.filter(
    t => t.usuario_id == usuarioId
  );

  res.json({
    ok: true,
    data: resultado
  });
};

const getById = (req, res) => {
  const item = tratamientos.find(
    t => t.id == req.params.id
  );
  if (!item) return res.status(404)
    .json({ ok: false, msg: 'No encontrado' });
  res.json({ ok: true, data: item });
};

const create = (req, res) => {
  const nuevo = { id: Date.now(), ...req.body };
  tratamientos.push(nuevo);
  res.status(201).json({ ok: true, data: nuevo });
};
module.exports = { getAll, getById, create };