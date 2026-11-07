const mongoose = require('mongoose');
const Programa = require('../models/Programa');
const Facultad = require('../models/Facultad');

const idValido = (id) => mongoose.Types.ObjectId.isValid(id);

// POST /api/programas
const crearPrograma = async (req, res) => {
  try {
    const { nombre, facultad } = req.body;

    if (!facultad || !idValido(facultad)) {
      return res.status(400).json({ mensaje: 'El id de la facultad no es válido' });
    }
    const existeFacultad = await Facultad.findById(facultad);
    if (!existeFacultad) {
      return res.status(404).json({ mensaje: 'La facultad no existe' });
    }

    const programa = await Programa.create({ nombre, facultad });
    res.status(201).json(programa);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

// GET /api/programas  (opcional: ?facultad=<id> para filtrar)
const listarProgramas = async (req, res) => {
  try {
    const filtro = {};
    if (req.query.facultad) {
      if (!idValido(req.query.facultad)) {
        return res.status(400).json({ mensaje: 'El id de la facultad no es válido' });
      }
      filtro.facultad = req.query.facultad;
    }
    const programas = await Programa.find(filtro).populate('facultad', 'nombre');
    res.json(programas);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// GET /api/programas/:id
const obtenerPrograma = async (req, res) => {
  try {
    if (!idValido(req.params.id)) {
      return res.status(400).json({ mensaje: 'Id no válido' });
    }
    const programa = await Programa.findById(req.params.id).populate('facultad', 'nombre');
    if (!programa) return res.status(404).json({ mensaje: 'Programa no encontrado' });
    res.json(programa);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// PUT /api/programas/:id
const actualizarPrograma = async (req, res) => {
  try {
    if (!idValido(req.params.id)) {
      return res.status(400).json({ mensaje: 'Id no válido' });
    }
    if (req.body.facultad) {
      if (!idValido(req.body.facultad) || !(await Facultad.findById(req.body.facultad))) {
        return res.status(404).json({ mensaje: 'La facultad no existe' });
      }
    }
    const programa = await Programa.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!programa) return res.status(404).json({ mensaje: 'Programa no encontrado' });
    res.json(programa);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

// DELETE /api/programas/:id
const eliminarPrograma = async (req, res) => {
  try {
    if (!idValido(req.params.id)) {
      return res.status(400).json({ mensaje: 'Id no válido' });
    }
    const programa = await Programa.findByIdAndDelete(req.params.id);
    if (!programa) return res.status(404).json({ mensaje: 'Programa no encontrado' });
    res.json({ mensaje: 'Programa eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

module.exports = {
  crearPrograma,
  listarProgramas,
  obtenerPrograma,
  actualizarPrograma,
  eliminarPrograma,
};