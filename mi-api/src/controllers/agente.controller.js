const predecirIntencion = async (req, res) => {
  const { texto } = req.body;

  if (typeof texto !== 'string' || !texto.trim()) {
    return res.status(400).json({
      mensaje: 'Debes enviar un texto para clasificar.',
    });
  }

  try {
    const respuesta = await fetch(
      `${process.env.AGENTE_IA_URL}/predecir`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto: texto.trim() }),
      }
    );

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      return res.status(502).json({
        mensaje: 'El servicio de inteligencia artificial no pudo procesar el mensaje.',
      });
    }

    return res.status(200).json(resultado);
  } catch (error) {
    console.error('Error al consultar el servicio de IA:', error.message);

    return res.status(503).json({
      mensaje: 'El servicio de inteligencia artificial no está disponible.',
    });
  }
};

module.exports = { predecirIntencion };