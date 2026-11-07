import mongoose from 'mongoose';

import * as facultadesService from './facultades.service.js';

// LISTAR FACULTADES
export async function listarfacultades(req, res) {
    try {
        const facultades = await facultadesService.listarfacultades();

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: 'Facultades listadas correctamente',
            data: facultades
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: 'Error al listar facultades'
        });
    }
}

// OBTENER FACULTAD POR ID
export async function obtenerFacultadPorId(req, res) {
    try {
        const id = req.params.id

        if (!mongoose.isValidObjectId(id) || id <= 0) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: 'ID de facultad inválido'
            });
        }

        const facultad = await facultadesService.obtenerFacultadPorId(id);

        if (!facultad) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: 'Facultad no encontrada'
            });
        }

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: 'Facultad obtenida correctamente',
            data: facultad
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: 'Error al obtener facultad'
        });
    }
}

// CREAR FACULTAD
export async function crearFacultad(req, res) {
    try {
        const { nombre } = req.body ?? {};

        if (typeof nombre !== 'string' || nombre.trim() === '') {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: 'El campo "nombre" es obligatorio'
            });
        }

        if (nombre.trim().length < 3 || nombre.trim().length > 150) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: 'El nombre debe tener entre 3 y 150 caracteres'
            });
        }

        const facultad = await facultadesService.crearFacultad(nombre.trim());

        return res.status(201).json({
            statusCode: 201,
            success: true,
            message: 'Facultad creada correctamente',
            data: facultad
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: 'Error al crear facultad'
        });
    }
}

// ACTUALIZAR FACULTAD
export async function actualizarFacultad(req, res) {
    try {
        const id = req.params.id
        const { nombre } = req.body ?? {};

        if (!mongoose.isValidObjectId(id) || id <= 0) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: 'ID de facultad inválido'
            });
        }

        if (typeof nombre !== 'string' || nombre.trim() === '') {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: 'El campo "nombre" es obligatorio'
            });
        }

        if (nombre.trim().length < 3 || nombre.trim().length > 150) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: 'El nombre debe tener entre 3 y 150 caracteres'
            });
        }

        const facultad = await facultadesService.obtenerFacultadPorId(id);

        if (!facultad) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: 'Facultad no encontrada'
            });
        }

        await facultadesService.actualizarFacultad(id, nombre.trim());

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: 'Facultad actualizada correctamente',
            data: await facultadesService.obtenerFacultadPorId(id)
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: 'Error al actualizar facultad'
        });
    }
}

// ELIMINAR FACULTAD
export async function eliminarFacultad(req, res) {
    try {
        const id = req.params.id

        if (!mongoose.isValidObjectId(id) || id <= 0) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: 'ID de facultad inválido'
            });
        }

        const eliminado = await facultadesService.eliminarFacultad(id);

        if (!eliminado) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: 'Facultad no encontrada'
            });
        }

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: 'Facultad eliminada correctamente'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: 'Error al eliminar facultad'
        });
    }
}
