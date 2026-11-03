import { Router } from "express";

import {
    listarfacultades,
    obtenerFacultadPorId,
    crearFacultad,
    actualizarFacultad,
    eliminarFacultad
} from "./facultades.controller.js";

const router = Router();

router.get("/show/", listarfacultades);
router.get("/info/:id", obtenerFacultadPorId);
router.post("/create", crearFacultad);
router.put("/update/:id", actualizarFacultad);
router.delete("/delete/:id", eliminarFacultad);

export default router;