
import * as programasService from './programas.service.js';

// LISTAR PROGRAMAS
export async function listarprogramas(req, res) {
    try {
        const programas = await programasService.listarprogramas();

        res.json({
            statusCode: 200,
            success: true,
            message: 'Programas listados correctamente',
            data: programas
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: 'Error al listar programas'
        });
    }
}

// OBTENER PROGRAMA POR ID
export async function obtenerProgramaPorId(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
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

        res.json({
            statusCode: 200,
            success: true,
            message: 'Programa obtenido correctamente',
            data: programa
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: 'Error al obtener programa'
        });
    }
}

// CREAR PROGRAMA
export async function crearPrograma(req, res) {
    try {
        const { codigo, facultad_id, nombre, nivel, modalidad } = req.body ?? {};

        if (!codigo || !facultad_id || !nombre || !nivel || !modalidad) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: 'Todos los campos son obligatorios'
            });
        }

        if (typeof codigo !== 'string' || codigo.trim().length > 30 ||
            typeof nombre !== 'string' || nombre.trim().length < 3 || nombre.trim().length > 150) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: 'Código o nombre inválido'
            });
        }

        if (!Number.isInteger(Number(facultad_id)) || Number(facultad_id) <= 0) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: 'ID de facultad inválido'
            });
        }

        if (!['pregrado', 'posgrado', 'otro'].includes(nivel) ||
            !['presencial', 'virtual', 'hibrida'].includes(modalidad)) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: 'Nivel o modalidad inválidos'
            });
        }

        const programa = await programasService.crearPrograma(
            codigo.trim(), Number(facultad_id), nombre.trim(), nivel, modalidad
        );

        res.status(201).json({
            statusCode: 201,
            success: true,
            message: 'Programa creado correctamente',
            data: programa
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: 'Error al crear programa'
        });
    }
}

// ACTUALIZAR PROGRAMA
export async function actualizarPrograma(req, res) {
    try {
        const id = Number(req.params.id);
        const { codigo, facultad_id, nombre, nivel, modalidad } = req.body ?? {};

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: 'ID de programa inválido'
            });
        }

        if (!codigo || !facultad_id || !nombre || !nivel || !modalidad) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: 'Todos los campos son obligatorios'
            });
        }

        if (typeof codigo !== 'string' || codigo.trim().length > 30 ||
            typeof nombre !== 'string' || nombre.trim().length < 3 || nombre.trim().length > 150) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: 'Código o nombre inválido'
            });
        }

        if (!Number.isInteger(Number(facultad_id)) || Number(facultad_id) <= 0) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: 'ID de facultad inválido'
            });
        }

        if (!['pregrado', 'posgrado', 'otro'].includes(nivel) ||
            !['presencial', 'virtual', 'hibrida'].includes(modalidad)) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: 'Nivel o modalidad inválidos'
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

        await programasService.actualizarPrograma(
            id, codigo.trim(), Number(facultad_id), nombre.trim(), nivel, modalidad
        );

        res.json({
            statusCode: 200,
            success: true,
            message: 'Programa actualizado correctamente'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: 'Error al actualizar programa'
        });
    }
}

// ELIMINAR PROGRAMA
export async function eliminarPrograma(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
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

        await programasService.eliminarPrograma(id);

        res.json({
            statusCode: 200,
            success: true,
            message: 'Programa eliminado correctamente'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: 'Error al eliminar programa'
        });
    }
}
