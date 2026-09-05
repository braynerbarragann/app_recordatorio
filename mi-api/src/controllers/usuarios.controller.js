let ususarios = [
  { id: 1, nombre: 'Lap', telefono: '213213123' }
];

const getAll = (req, res) => {
  res.json({ ok: true, data: ususarios });
};

const getById = (req, res) => {
  const item = ususarios.find(
    u => u.id == req.params.id
  );
  if (!item) return res.status(404)
    .json({ ok: false, msg: 'No encontrado' });
  res.json({ ok: true, data: item });
};

const create = (req, res) => {
  const nuevo = { id: Date.now(), ...req.body };
  ususarios.push(nuevo);
  res.status(201).json({ ok: true, data: nuevo });
};
module.exports = { getAll, getById, create };