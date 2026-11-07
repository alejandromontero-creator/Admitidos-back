import facultad from "./facultades.model.js";

// LISTAR TODAS LAS FACULTADES
export async function listarfacultades() {
    return await facultad.find().sort({ nombre: 1 });
}

// OBTENER FACULTAD POR ID
export async function obtenerFacultadPorId(id) {
    return await facultad.findById(id);
}

// CREAR FACULTAD
export async function crearFacultad(nombre) {
    return await facultad.create({ nombre });
}

// ACTUALIZAR FACULTAD
export async function actualizarFacultad(id, nombre) {
    return await facultad.findByIdAndUpdate(
        id,
        { nombre },
        { returnDocument: "after", runValidators: true }
    );
}

// ELIMINAR FACULTAD
export async function eliminarFacultad(id) {
    const eliminada = await facultad.findByIdAndDelete(id);
    return eliminada !== null;
}
