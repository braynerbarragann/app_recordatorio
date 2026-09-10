let tratamientos_medicamentos = [
    {
    id: 1,
    tratamiento_id: 1,
    medicamento_id: 1,
    instruccion: 'tratamiento1',
    dosis: '2',
    unidad_dosis: '2',
    frecuencia_horas: '2',
    fecha_inicio: '2',
    fecha_fin: '2'
    },
    {
    id: 2,
    tratamiento_id: 3,
    medicamento_id: 1,
    instruccion: 'tratamiento2',
    dosis: '2',
    unidad_dosis: '2',
    frecuencia_horas: '3',
    fecha_inicio: '3',
    fecha_fin: '3'
    },
    {
    id: 3,
    tratamiento_id: 2,
    medicamento_id: 2,
    instruccion: 'tratamiento3',
    dosis: '2',
    unidad_dosis: '2',
    frecuencia_horas: '3',
    fecha_inicio: '3',
    fecha_fin: '3'
    }

];

const getAll = (req, res) => {

  const tratamientoId = req.params.tratamientoId;

  const resultado = tratamientos_medicamentos.filter(
    t => t.tratamiento_id == tratamientoId 
  );

  res.json({
    ok: true,
    data: resultado
  });
};

const getById = (req, res) => {
  const item = tratamientos_medicamentos.find(
    t => t.id == req.params.traMedicaId
  );
  if (!item) return res.status(404)
    .json({ ok: false, msg: 'No encontrado' });
  res.json({ ok: true, data: item });
};

const create = (req, res) => {
  const nuevo = { id: Date.now(), ...req.body };
  tratamientos_medicamentos.push(nuevo);
  res.status(201).json({ ok: true, data: nuevo });
};
module.exports = { getAll, getById, create };