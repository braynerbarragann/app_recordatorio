let usuarios = [
  { id: 1,
    nombre: 'Lap', 
    telefono: '213213123',
    genero: 'Masculino',
    correo: 'Lap@gmail.com',
    edad: '45'
     },

  { id: 2,
    nombre: 'Carlos',
    telefono: '3124356622',
    genero: 'Masculino',
    correo: 'carlos@gmail.com',
    edad: '68'
  }      
];

const getAll = (req, res) => {
  res.json({ ok: true, data: usuarios });
};

const getById = (req, res) => {
  const item = usuarios.find(
    u => u.id == req.params.id
  );
  if (!item) return res.status(404)
    .json({ ok: false, msg: 'No encontrado' });
  res.json({ ok: true, data: item });
};

const create = (req, res) => {
  const nuevo = { id: Date.now(), ...req.body };
  usuarios.push(nuevo);
  res.status(201).json({ ok: true, data: nuevo });
};

module.exports = { getAll, getById, create};