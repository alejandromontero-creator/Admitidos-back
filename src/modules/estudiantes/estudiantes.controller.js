import mongoose from "mongoose";

import * as estudiantesService from "./estudiantes.service.js";

const CAMPOS = ["nombre", "apellido", "documento", "correo", "programa", "estado"];
const ESTADOS = ["admitido", "pendiente", "rechazado"];
const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function responder(res, statusCode, message, data) {
  const body = { statusCode, success: statusCode < 400, message };
  if (data !== undefined) body.data = data;
  return res.status(statusCode).json(body);
}

function esTexto(valor) {
  return typeof valor === "string" && valor.trim() !== "";
}

function tomarCampos(body) {
  return Object.fromEntries(
    CAMPOS.filter((campo) => body[campo] !== undefined).map((campo) => [campo, body[campo]])
  );
}

async function validar(datos, parcial = false) {
  for (const campo of ["nombre", "apellido", "documento"]) {
    if (parcial && datos[campo] === undefined) continue;
    if (!esTexto(datos[campo])) return [400, `El campo "${campo}" es obligatorio`];
  }

  if (!parcial || datos.correo !== undefined) {
    if (!esTexto(datos.correo) || !FORMATO_CORREO.test(datos.correo)) {
      return [400, 'El campo "correo" no es válido'];
    }
  }

  if (!parcial || datos.programa !== undefined) {
    if (!esTexto(datos.programa)) return [400, 'El campo "programa" es obligatorio'];
    if (!mongoose.isValidObjectId(datos.programa)) return [400, "ID de programa inválido"];
    if (!(await estudiantesService.existePrograma(datos.programa))) {
      return [404, "El programa no existe"];
    }
  }

  if (datos.estado !== undefined && !ESTADOS.includes(datos.estado)) {
    return [400, 'El "estado" debe ser: admitido, pendiente o rechazado'];
  }

  return null;
}

function manejarError(res, error) {
  if (error.code === 11000) {
    const campo = Object.keys(error.keyValue)[0];
    return responder(res, 409, `Ya existe un estudiante con ese ${campo}`);
  }
  return responder(res, 500, "Error interno del servidor");
}

export async function listarEstudiantes(req, res) {
  try {
    const { programa } = req.query;
    if (programa && !mongoose.isValidObjectId(programa)) {
      return responder(res, 400, "ID de programa inválido");
    }
    const estudiantes = await estudiantesService.listarEstudiantes(programa);
    return responder(res, 200, "Estudiantes encontrados", estudiantes);
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function obtenerEstudiantePorId(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return responder(res, 400, "ID de estudiante inválido");
    }
    const estudiante = await estudiantesService.obtenerEstudiantePorId(req.params.id);
    if (!estudiante) return responder(res, 404, "Estudiante no encontrado");
    return responder(res, 200, "Estudiante encontrado", estudiante);
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function crearEstudiante(req, res) {
  try {
    const body = req.body ?? {};
    const error = await validar(body);
    if (error) return responder(res, ...error);

    const estudiante = await estudiantesService.crearEstudiante(tomarCampos(body));
    return responder(res, 201, "Estudiante creado", estudiante);
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function actualizarEstudiante(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return responder(res, 400, "ID de estudiante inválido");
    }
    const body = req.body ?? {};
    const error = await validar(body, true);
    if (error) return responder(res, ...error);

    const estudiante = await estudiantesService.actualizarEstudiante(req.params.id, tomarCampos(body));
    if (!estudiante) return responder(res, 404, "Estudiante no encontrado");
    return responder(res, 200, "Estudiante actualizado", estudiante);
  } catch (error) {
    return manejarError(res, error);
  }
}

export async function eliminarEstudiante(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return responder(res, 400, "ID de estudiante inválido");
    }
    const estudiante = await estudiantesService.eliminarEstudiante(req.params.id);
    if (!estudiante) return responder(res, 404, "Estudiante no encontrado");
    return responder(res, 200, "Estudiante eliminado");
  } catch (error) {
    return manejarError(res, error);
  }
}