import { Router } from "express";

import {
    listarEstudiantes,
    obtenerEstudiantePorId,
    crearEstudiante,
    actualizarEstudiante,
    eliminarEstudiante,
    obtenerMiPerfil
} from "./estudiantes.controller.js";
import { verificarToken, soloRol } from "../auth/auth.middleware.js";

const router = Router();
const soloAdmin = [verificarToken, soloRol("admin")];

router.get("/mi-perfil", verificarToken, soloRol("estudiante"), obtenerMiPerfil);
router.get("/show/", soloAdmin, listarEstudiantes);
router.get("/info/:id", soloAdmin, obtenerEstudiantePorId);
router.post("/create", soloAdmin, crearEstudiante);
router.put("/update/:id", soloAdmin, actualizarEstudiante);
router.delete("/delete/:id", soloAdmin, eliminarEstudiante);

export default router;