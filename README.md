# Admitidos - Backend

API en Node.js, Express y MongoDB del sistema de admitidos.
Frontend: [admitidos-front](https://github.com/alejandromontero-creator/admitidos-front)

## Tablas
- **facultades**
- **programas** (cada programa pertenece a una facultad)
- **estudiantes** (cada estudiante pertenece a un programa)
- **usuarios** (autenticación con roles admin y estudiante)

## Cómo correrlo
1. Crear un archivo `.env` con:
```
MONGODB_URI=tu_cadena_de_conexion
JWT_SECRET=una_frase_secreta
PORT=3000
```
2. Instalar y arrancar:
```
npm install
npm run dev
```
3. Crear el primer administrador con `POST /api/auth/setup` enviando `correo` y `password`.

## Rutas principales
- `POST /api/auth/login` – iniciar sesión (devuelve el token)
- `/api/facultades`, `/api/programas`, `/api/estudiantes` – `show`, `info/:id`, `create`, `update/:id`, `delete/:id`
- `GET /api/estudiantes/mi-perfil` – perfil del estudiante con sesión iniciada
- `POST /api/auth/usuarios` – el admin crea la cuenta de un estudiante
