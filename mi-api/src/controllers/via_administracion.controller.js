let via_administracion = [
   {id: 1,
    nombre: 'intravenoso',
    descripcion: '21322'},

   {id: 2,
    nombre: 'topico',
    descripcion: '32345'
    }
];

const getAll = (req, res) => {
  res.json({ ok: true, data: via_administracion });
};

const getById = (req, res) => {
  const item = via_administracion.find(
    v => v.id == req.params.id
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