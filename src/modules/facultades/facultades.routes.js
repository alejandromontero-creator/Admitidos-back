import { Router } from "express";

import {
    listarfacultades,
    obtenerFacultadPorId,
    crearFacultad,
    actualizarFacultad,
    eliminarFacultad
} from "./facultades.controller.js";
import { verificarToken, soloRol } from "../auth/auth.middleware.js";

const router = Router();
const soloAdmin = [verificarToken, soloRol("admin")];

router.get("/show/", verificarToken, listarfacultades);
router.get("/info/:id", verificarToken, obtenerFacultadPorId);
router.post("/create", soloAdmin, crearFacultad);
router.put("/update/:id", soloAdmin, actualizarFacultad);
router.delete("/delete/:id", soloAdmin, eliminarFacultad);

export default router;