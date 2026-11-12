import estudiante from "./estudiantes.model.js";
import programa from "../programas/programas.model.js";

const conPrograma = {
  path: "programa",
  select: "nombre",
  populate: { path: "facultad", select: "nombre" }
};

export async function existePrograma(id) {
  return (await programa.exists({ _id: id })) !== null;
}

export async function listarEstudiantes(programaId) {
  const filtro = programaId ? { programa: programaId } : {};
  return await estudiante.find(filtro).populate(conPrograma).sort({ apellido: 1 });
}

export async function obtenerEstudiantePorId(id) {
  return await estudiante.findById(id).populate(conPrograma);
}

export async function crearEstudiante(datos) {
  return await estudiante.create(datos);
}

export async function actualizarEstudiante(id, datos) {
  return await estudiante
    .findByIdAndUpdate(id, datos, { new: true, runValidators: true })
    .populate(conPrograma);
}

export async function eliminarEstudiante(id) {
  return await estudiante.findByIdAndDelete(id);
}