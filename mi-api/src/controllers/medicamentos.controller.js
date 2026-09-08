let medicamentos = [
   {
    id: 1,
    via_administracion_id: 1,
    nombre: "Acetaminofén",
    presentacion: "Tableta",
    concentracion: "500 mg",
    descripcion: "Analgésico y antipirético"
  },
   {
    id: 2,
    via_administracion_id: 1,
    nombre: "Acetaminofén",
    presentacion: "Tableta",
    concentracion: "1000 mg",
    descripcion: "Analgésico y antipirético"
  },
   {
    id: 3,
    via_administracion_id: 2,
    nombre: "Acetaminofén",
    presentacion: "Tableta",
    concentracion: "250 mg",
    descripcion: "Analgésico y antipirético"
  },

  
];

const getAll = (req, res) => {
  res.json({ ok: true, data: medicamentos });
};

const getById = (req, res) => {
  const item = medicamentos.find(
    m => m.id == req.params.id
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