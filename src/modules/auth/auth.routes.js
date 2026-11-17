import { Router } from "express";

import { crearPrimerAdmin, login, crearUsuarioEstudiante } from "./auth.controller.js";
import { verificarToken, soloRol } from "./auth.middleware.js";

const router = Router();

router.post("/setup", crearPrimerAdmin);
router.post("/login", login);
router.post("/usuarios", verificarToken, soloRol("admin"), crearUsuarioEstudiante);

export default router;