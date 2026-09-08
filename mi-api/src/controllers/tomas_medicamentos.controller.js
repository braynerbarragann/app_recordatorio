let tomas_medicamentos = [
    {
    id: 1,
    tratamiento_medicamento_id: 1,
    estado: 'agendado',
    fecha_hora_programada: 'hoy',
    fecha_hora_registro: '21322'
    },
    {
    id: 2,
    tratamiento_medicamento_id: 2,
    estado: 'agendado',
    fecha_hora_programada: '21322',
    fecha_hora_registro: '21322'
    },
    {
    id: 3,
    tratamiento_medicamento_id: 3,
    estado: 'agendado',
    fecha_hora_programada: '21322',
    fecha_hora_registro: '21322'
    },

];

const getAll = (req, res) => {

  const traMedicaID= req.params.traMedicaID;

  const resultado = tomas_medicamentos.filter(
    t => t.tratamiento_medicamento_id == traMedicaID
  );

  res.json({
    ok: true,
    data: resultado
  });
};

const getById = (req, res) => {
  const item = tomas_medicamentos.find(
    t => t.id == req.params.tomaId
  );
  if (!item) return res.status(404)
    .json({ ok: false, msg: 'No encontrado' });
  res.json({ ok: true, data: item });
};

const create = (req, res) => {
  const nuevo = { id: Date.now(), ...req.body };
  tomas_medicamentos.push(nuevo);
  res.status(201).json({ ok: true, data: nuevo });
};
module.exports = { getAll, getById, create };