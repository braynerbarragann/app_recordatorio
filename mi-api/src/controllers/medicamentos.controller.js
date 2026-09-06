let medicamentos = [
   {id: 1,
    nombre: 'Acetaminofen',
    descripcion: '21322'},

   {id: 2,
    nombre: 'Loratadina',
    descripcion: '32345'
    }
];

const getAll = (req, res) => {
  res.json({ ok: true, data: medicamentos });
};

const getById = (req, res) => {
  const item = medicamentos.find(
    u => u.id == req.params.id
  );
  if (!item) return res.status(404)
    .json({ ok: false, msg: 'No encontrado' });
  res.json({ ok: true, data: item });
};

const create = (req, res) => {
  const nuevo = { id: Date.now(), ...req.body };
  medicamentos.push(nuevo);
  res.status(201).json({ ok: true, data: nuevo });
};
module.exports = { getAll, getById, create };