
import db from '../../config/database.js';

// VALIDAR ID
function validarId(id) {
    if (!Number.isInteger(id) || id <= 0) {
        throw new Error('ID de facultad inválido');
    }
}

// VALIDAR NOMBRE
function validarNombre(nombre) {
    if (typeof nombre !== 'string' || nombre.trim() === '') {
        throw new Error('El campo "nombre" es obligatorio');
    }

    if (nombre.trim().length < 3 || nombre.trim().length > 150) {
        throw new Error('El nombre debe tener entre 3 y 150 caracteres');
    }
}

// LISTAR TODAS LAS FACULTADES
export async function listarfacultades() {
    const [rows] = await db.query(`
        SELECT
            id,
            nombre,
            created_at AS createdAt,
            updated_at AS updatedAt
        FROM facultades
        ORDER BY nombre ASC
    `);

    return rows;
}

// OBTENER FACULTAD POR ID
export async function obtenerFacultadPorId(id) {
    validarId(id);

    const [rows] = await db.query(`
        SELECT
            id,
            nombre,
            created_at AS createdAt,
            updated_at AS updatedAt
        FROM facultades
        WHERE id = ?
    `, [id]);

    return rows[0] || null;
}

// CREAR FACULTAD
export async function crearFacultad(nombre) {
    validarNombre(nombre);

    const [result] = await db.query(`
        INSERT INTO facultades (nombre)
        VALUES (?)
    `, [nombre.trim()]);

    return await obtenerFacultadPorId(result.insertId);
}

// ACTUALIZAR FACULTAD
export async function actualizarFacultad(id, nombre) {
    validarId(id);
    validarNombre(nombre);

    await db.query(`UPDATE facultades SET nombre = ? WHERE id = ?`, [nombre.trim(), id]
    );
}

// ELIMINAR FACULTAD
export async function eliminarFacultad(id) {
    validarId(id);

    const [result] = await db.query(`DELETE FROM facultades WHERE id = ?`, [id]
    );

    return result.affectedRows > 0;
}
