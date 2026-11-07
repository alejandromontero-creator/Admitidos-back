import mongoose from 'mongoose';

import * as programasService from './programas.service.js';

// VALIDAR NOMBRE (devuelve el mensaje de error o null si está bien)
function validarNombre(nombre) {
    if (typeof nombre !== 'string' || nombre.trim() === '') {
        return 'El campo "nombre" es obligatorio';
    }
    if (nombre.trim().length < 3 || nombre.trim().length > 150) {
        return 'El nombre debe tener entre 3 y 150 caracteres';
    }
    return null;
}

// VALIDAR FACULTAD (formato del id + que exista en la base de datos)
async function validarFacultad(facultad) {
    if (typeof facultad !== 'string' || facultad.trim() === '') {
        return { status: 400, message: 'El campo "facultad" es obligatorio' };
    }
    if (!mongoose.isValidObjectId(facultad)) {
        return { status: 400, message: 'ID de facultad inválido' };
    }
    if (!(await programasService.existeFacultad(facultad))) {
        return { status: 404, message: 'La facultad no existe' };
    }
    return null;
}

// LISTAR PROGRAMAS (opcional: ?facultad=<id>)
export async function listarprogramas(req, res) {
    try {
        const { facultad } = req.query;

        if (facultad !== undefined && (typeof facultad !== 'string' || !mongoose.isValidObjectId(facultad))) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: 'ID de facultad inválido'
            });
        }

        const programas = await programasService.listarprogramas(facultad);

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: 'Programas listados correctamente',
            data: programas
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: 'Error al listar programas'
        });
    }
}

// OBTENER PROGRAMA POR ID
export async function obtenerProgramaPorId(req, res) {
    try {
        const id = req.params.id

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: 'ID de programa inválido'
            });
        }

        const programa = await programasService.obtenerProgramaPorId(id);

        if (!programa) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: 'Programa no encontrado'
            });
        }

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: 'Programa obtenido correctamente',
            data: programa
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: 'Error al obtener programa'
        });
    }
}

// CREAR PROGRAMA
export async function crearPrograma(req, res) {
    try {
        const { nombre, facultad } = req.body ?? {};

        const errorNombre = validarNombre(nombre);
        if (errorNombre) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: errorNombre
            });
        }

        const errorFacultad = await validarFacultad(facultad);
        if (errorFacultad) {
            return res.status(errorFacultad.status).json({
                statusCode: errorFacultad.status,
                success: false,
                message: errorFacultad.message
            });
        }

        const programa = await programasService.crearPrograma(nombre.trim(), facultad);

        return res.status(201).json({
            statusCode: 201,
            success: true,
            message: 'Programa creado correctamente',
            data: programa
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: 'Error al crear programa'
        });
    }
}

// ACTUALIZAR PROGRAMA
export async function actualizarPrograma(req, res) {
    try {
        const id = req.params.id
        const { nombre, facultad } = req.body ?? {};

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: 'ID de programa inválido'
            });
        }

        const errorNombre = validarNombre(nombre);
        if (errorNombre) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: errorNombre
            });
        }

        const errorFacultad = await validarFacultad(facultad);
        if (errorFacultad) {
            return res.status(errorFacultad.status).json({
                statusCode: errorFacultad.status,
                success: false,
                message: errorFacultad.message
            });
        }

        const actualizado = await programasService.actualizarPrograma(id, nombre.trim(), facultad);

        if (!actualizado) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: 'Programa no encontrado'
            });
        }

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: 'Programa actualizado correctamente',
            data: await programasService.obtenerProgramaPorId(id)
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: 'Error al actualizar programa'
        });
    }
}

// ELIMINAR PROGRAMA
export async function eliminarPrograma(req, res) {
    try {
        const id = req.params.id

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: 'ID de programa inválido'
            });
        }

        const eliminado = await programasService.eliminarPrograma(id);

        if (!eliminado) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: 'Programa no encontrado'
            });
        }

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: 'Programa eliminado correctamente'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: 'Error al eliminar programa'
        });
    }
}
