import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import usuario from "./usuarios.model.js";
import mongoose from "mongoose";
import estudiante from "../estudiantes/estudiantes.model.js";

const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function responder(res, statusCode, message, data) {
  const body = { statusCode, success: statusCode < 400, message };
  if (data !== undefined) body.data = data;
  return res.status(statusCode).json(body);
}

function datosValidos(correo, password) {
  return typeof correo === "string" && FORMATO_CORREO.test(correo.trim())
    && typeof password === "string" && password.length >= 6;
}

export async function crearPrimerAdmin(req, res) {
  try {
    if (await usuario.exists({ rol: "admin" })) {
      return responder(res, 403, "Ya existe un administrador");
    }
    const { correo, password } = req.body ?? {};
    if (!datosValidos(correo, password)) {
      return responder(res, 400, "Correo válido y contraseña de mínimo 6 caracteres");
    }
    const admin = await usuario.create({
      correo,
      password: await bcrypt.hash(password, 10),
      rol: "admin"
    });
    return responder(res, 201, "Administrador creado", { correo: admin.correo, rol: admin.rol });
  } catch (error) {
    return responder(res, 500, "Error interno del servidor");
  }
}

export async function login(req, res) {
  try {
    const { correo, password } = req.body ?? {};
    if (typeof correo !== "string" || typeof password !== "string" || !correo.trim() || !password) {
      return responder(res, 400, "Correo y contraseña son obligatorios");
    }
    const encontrado = await usuario
      .findOne({ correo: correo.trim().toLowerCase() })
      .select("+password");

    if (!encontrado || !(await bcrypt.compare(password, encontrado.password))) {
      return responder(res, 401, "Correo o contraseña incorrectos");
    }

    const token = jwt.sign(
      { id: encontrado._id, rol: encontrado.rol, estudiante: encontrado.estudiante },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );
    return responder(res, 200, "Inicio de sesión correcto", {
      token,
      correo: encontrado.correo,
      rol: encontrado.rol
    });
  } catch (error) {
    return responder(res, 500, "Error interno del servidor");
  }
}

export async function crearUsuarioEstudiante(req, res) {
  try {
    const { estudiante: estudianteId, password } = req.body ?? {};
    if (!mongoose.isValidObjectId(estudianteId)) {
      return responder(res, 400, "ID de estudiante inválido");
    }
    if (typeof password !== "string" || password.length < 6) {
      return responder(res, 400, "La contraseña debe tener mínimo 6 caracteres");
    }
    const encontrado = await estudiante.findById(estudianteId);
    if (!encontrado) return responder(res, 404, "Estudiante no encontrado");
    if (await usuario.exists({ estudiante: estudianteId })) {
      return responder(res, 409, "Este estudiante ya tiene cuenta");
    }
    const nuevo = await usuario.create({
      correo: encontrado.correo,
      password: await bcrypt.hash(password, 10),
      rol: "estudiante",
      estudiante: estudianteId
    });
    return responder(res, 201, "Cuenta de estudiante creada", { correo: nuevo.correo, rol: nuevo.rol });
  } catch (error) {
    if (error.code === 11000) return responder(res, 409, "Ya existe una cuenta con ese correo");
    return responder(res, 500, "Error interno del servidor");
  }
}