import express from "express";

const app = express();

app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "localhost";
const APP_NAME = process.env.app_name || "API Universidad";

// HEALTH CHECK


// FACULTADES
const facultades = [
  { id: 1, name: "Facultad de Ciencias Empresariales" },
  { id: 2, name: "Facultad de Ciencias de la Salud" },
  { id: 3, name: "Facultad de Derecho y Ciencias Políticas" },
  { id: 4, name: "Facultad de Educación" },
];

// PROGRAMAS
const programas = [
  {
    id: 1,
    codigo: "is",
    facultadId: 1,
    name: "Ingeniería de Sistemas",
    nivel: "Pregrado",
    Createby: "system",
    CreateAt: new Date().toISOString(),
    UpdateBy: "system",
    UpdateAt: new Date().toISOString(),
  },
  {
    id: 2,
    codigo: "cc",
    facultadId: 1,
    name: "Contabilidad y Finanzas",
    nivel: "Pregrado",
    Createby: "system",
    CreateAt: new Date().toISOString(),
    UpdateBy: "system",
    UpdateAt: new Date().toISOString(),
  },
  {
    id: 3,
    codigo: "en",
    facultadId: 2,
    name: "Enfermería",
    nivel: "Pregrado",
    Createby: "system",
    CreateAt: new Date().toISOString(),
    UpdateBy: "system",
    UpdateAt: new Date().toISOString(),
  },
  {
    id: 4,
    codigo: "md",
    facultadId: 2,
    name: "Medicina",
    nivel: "Pregrado",
    Createby: "system",
    CreateAt: new Date().toISOString(),
    UpdateBy: "system",
    UpdateAt: new Date().toISOString(),
  },
];

// VARIABLES
let nextProgramaId = 5;

const nivelesPermitidos = ["Pregrado", "Posgrado", "otro"];

// OBTENER FACULTADES
app.get("/api/facultades", (req, res) => {
  res.json({
    data: facultades,
    statuscode: 200,
  });
});

// OBTENER PROGRAMAS
app.get("/api/programas", (req, res) => {
  res.json({
    data: programas,
    statuscode: 200,
  });
});

// CREAR PROGRAMA
app.post("/api/programas/store", (req, res) => {
  console.log(req.body);

  const { facultadId, name, nivel } = req.body;

  // 1. VALIDAR CAMPOS OBLIGATORIOS
  if (
    !facultadId ||
    typeof name !== "string" ||
    !name.trim() ||
    typeof nivel !== "string" ||
    !nivel.trim()
  ) {
    return res.status(422).json({
      statuscode: 422,
      success: false,
      message:
        "Los campos 'facultadId', 'name' y 'nivel' son obligatorios.",
    });
  }

  // 2. VALIDAR QUE LA FACULTAD EXISTA
  const facultadExists = facultades.some(
    (facultad) => facultad.id === Number(facultadId)
  );

  if (!facultadExists) {
    return res.status(404).json({
      statuscode: 404,
      success: false,
      message: `La facultad con id ${facultadId} no existe.`,
    });
  }

  // 3. VALIDAR NIVEL
  const nivelNormalizado = nivelesPermitidos.find(
    (item) => item.toLowerCase() === nivel.trim().toLowerCase()
  );

  if (!nivelNormalizado) {
    return res.status(422).json({
      statuscode: 422,
      success: false,
      message: "El nivel debe ser Pregrado, Posgrado u otro.",
    });
  }

  // 4. NORMALIZAR NOMBRE
  const nombrenormalizado = name.trim().toLowerCase();

  // 5. VALIDAR PROGRAMA DUPLICADO
  const programaExiste = programas.some(
    (programa) =>
      programa.facultadId === Number(facultadId) &&
      programa.name.trim().toLowerCase() === nombrenormalizado
  );

  if (programaExiste) {
    return res.status(409).json({
      statuscode: 409,
      success: false,
      message:
        "Ya existe un programa con este nombre dentro de la facultad.",
    });
  }

  // 6. GENERAR CÓDIGO AUTOMÁTICO
  const codigo = `PROG-${String(nextProgramaId).padStart(4, "0")}`;

  // 7. CREAR NUEVO PROGRAMA
  const newPrograma = {
    id: nextProgramaId,
    codigo,
    facultadId: Number(facultadId),
    name: name.trim(),
    nivel: nivelNormalizado,
    Createby: "system",
    CreateAt: new Date().toISOString(),
    UpdateBy: "system",
    UpdateAt: new Date().toISOString(),
  };

  // 8. GUARDAR PROGRAMA
  programas.push(newPrograma);

  // 9. INCREMENTAR ID
  nextProgramaId++;

  // 10. RESPUESTA EXITOSA
  return res.status(201).json({
    statuscode: 201,
    success: true,
    message: "Programa creado correctamente.",
    data: newPrograma,
  });
});

// INICIAR SERVIDOR
app.listen(PORT, HOST, () => {
  console.log(APP_NAME);
  console.log(`Server is running on http://${HOST}:${PORT}`);
});