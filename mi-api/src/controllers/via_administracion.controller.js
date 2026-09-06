let via_administracion = [
   {id: 1,
    nombre: 'Capsula',
    descripcion: '21322'},

   {id: 2,
    nombre: 'Pastilla',
    descripcion: '32345'
    }
];

const getAll = (req, res) => {
  res.json({ ok: true, data: via_administracion });
};

const getById = (req, res) => {
  const item = via_administracion.find(
    u => u.id == req.params.id
  );
  if (!item) return res.status(404)
    .json({ ok: false, msg: 'No encontrado' });
  res.json({ ok: true, data: item });
};

const create = (req, res) => {
  const nuevo = { id: Date.now(), ...req.body };
  via_administracion.push(nuevo);
  res.status(201).json({ ok: true, data: nuevo });
};
module.exports = { getAll, getById, create };