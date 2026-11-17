import jwt from "jsonwebtoken";

function responder(res, statusCode, message) {
  return res.status(statusCode).json({ statusCode, success: false, message });
}

export function verificarToken(req, res, next) {
    const [tipo, token] = (req.headers.authorization ?? "").trim().split(/\s+/);
  if (tipo !== "Bearer" || !token) {
    return responder(res, 401, "Debes iniciar sesión");
  }
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    return responder(res, 401, "Sesión inválida o vencida");
  }
}

export function soloRol(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.usuario?.rol)) {
      return responder(res, 403, "No tienes permiso para esta acción");
    }
    return next();
  };
}