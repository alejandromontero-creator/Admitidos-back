import { Router } from "express";

import {
    listarprogramas,
    obtenerProgramaPorId,
    crearPrograma,
    actualizarPrograma,
    eliminarPrograma
} from "./programas.controller.js";
import { verificarToken, soloRol } from "../auth/auth.middleware.js";

const router = Router();
const soloAdmin = [verificarToken, soloRol("admin")];

router.get("/show/", verificarToken, listarprogramas);
router.get("/info/:id", verificarToken, obtenerProgramaPorId);
router.post("/create", soloAdmin, crearPrograma);
router.put("/update/:id", soloAdmin, actualizarPrograma);
router.delete("/delete/:id", soloAdmin, eliminarPrograma);

export default router;