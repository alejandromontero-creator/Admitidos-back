import programa from "./programas.model.js";
import facultad from "../facultades/facultades.model.js";

// VERIFICAR SI UNA FACULTAD EXISTE
export async function existeFacultad(id) {
    return (await facultad.exists({ _id: id })) !== null;
}

// LISTAR TODOS LOS PROGRAMAS (opcionalmente filtrados por facultad)
export async function listarprogramas(facultadId) {
    const filtro = facultadId ? { facultad: facultadId } : {};
    return await programa.find(filtro)
        .populate("facultad", "nombre")
        .sort({ nombre: 1 });
}

// OBTENER PROGRAMA POR ID
export async function obtenerProgramaPorId(id) {
    return await programa.findById(id).populate("facultad", "nombre");
}

// CREAR PROGRAMA
export async function crearPrograma(nombre, facultadId) {
    return await programa.create({ nombre, facultad: facultadId });
}

// ACTUALIZAR PROGRAMA
export async function actualizarPrograma(id, nombre, facultadId) {
    return await programa.findByIdAndUpdate(
        id,
        { nombre, facultad: facultadId },
        { returnDocument: "after", runValidators: true }
    );
}

// ELIMINAR PROGRAMA
export async function eliminarPrograma(id) {
    const eliminado = await programa.findByIdAndDelete(id);
    return eliminado !== null;
}
