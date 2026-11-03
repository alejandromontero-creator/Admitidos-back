
import db from '../../config/database.js';

// LISTAR TODOS LOS PROGRAMAS
export async function listarprogramas() {
    const [rows] = await db.query(`
        SELECT * FROM programas
        ORDER BY nombre ASC
    `);

    return rows;
}

// OBTENER PROGRAMA POR ID
export async function obtenerProgramaPorId(id) {
    const [rows] = await db.query(`
        SELECT * FROM programas WHERE id = ?
    `, [id]);

    return rows[0] || null;
}

// CREAR PROGRAMA
export async function crearPrograma(codigo, facultad_id, nombre, nivel, modalidad) {
    const [result] = await db.query(`
        INSERT INTO programas (codigo, facultad_id, nombre, nivel, modalidad)
        VALUES (?, ?, ?, ?, ?)
    `, [codigo, facultad_id, nombre, nivel, modalidad]);

    return await obtenerProgramaPorId(result.insertId);
}

// ACTUALIZAR PROGRAMA
export async function actualizarPrograma(id, codigo, facultad_id, nombre, nivel, modalidad) {
    await db.query(`
        UPDATE programas
        SET codigo = ?, facultad_id = ?, nombre = ?, nivel = ?, modalidad = ?
        WHERE id = ?
    `, [codigo, facultad_id, nombre, nivel, modalidad, id]);
}

// ELIMINAR PROGRAMA
export async function eliminarPrograma(id) {
    await db.query(`DELETE FROM programas WHERE id = ?`, [id]);
}
