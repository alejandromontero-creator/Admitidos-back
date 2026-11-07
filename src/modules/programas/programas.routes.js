const express = require('express');
const router = express.Router();
const {
  crearPrograma,
  listarProgramas,
  obtenerPrograma,
  actualizarPrograma,
  eliminarPrograma,
} = require('../controllers/programaController');

router.post('/', crearPrograma);
router.get('/', listarProgramas);
router.get('/:id', obtenerPrograma);
router.put('/:id', actualizarPrograma);
router.delete('/:id', eliminarPrograma);

module.exports = router;