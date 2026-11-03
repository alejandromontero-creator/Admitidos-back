 import { Router } from "express";

import {
    listarprogramas,
    obtenerProgramaPorId,
    crearPrograma,
    actualizarPrograma,
    eliminarPrograma
} from "./programas.controller.js";

const router = Router();

router.get("/show", listarprogramas);
router.get("/info/:id", obtenerProgramaPorId);
router.post("/create", crearPrograma);
router.put("/update/:id", actualizarPrograma);
router.delete("/delete/:id", eliminarPrograma);

export default router;