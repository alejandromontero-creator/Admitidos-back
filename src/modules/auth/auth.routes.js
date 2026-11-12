import { Router } from "express";

import { crearPrimerAdmin, login } from "./auth.controller.js";

const router = Router();

router.post("/setup", crearPrimerAdmin);
router.post("/login", login);

export default router;