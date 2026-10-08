import express from "express";

const app = express();

app.use(express.json());

const PORT = Number(process.env.PORT);
const HOST = process.env.HOST;
const APP_NAME = process.env.app_name;

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        success: true,
        message: "API functioning correctly",
        version: "1.0.0"
    })
});

/*const products = [
        { id: 1, name: "Product 1", price: 100 },
        { id: 2, name: "Product 2", price: 200 },
        { id: 3, name: "Product 3", price: 300 },
];*/

/*app.get("/api/products", (req, res) => {
       res.json({
        data: products,
        statuscode: 200
    });
});*/

const facultades = [
    { id: 1, name: "Facultad de Ciencias Empresariales" },
    { id: 2, name: "Facultad de Ciencias de la Salud" },
    { id: 3, name: "Facultad de Derecho y Ciencias Políticas" },
    { id: 4, name: "Facultad de Educación" },
];

const{
    codigo,
    facultadId,
    name,
    nivel,
} = req.body;

if (!facultadId || !name || !nivel) {
    return res.status(422).json({
        statuscode: 422,
        success: false,
        message: "Los campos 'codigo', 'facultadId', 'name' y 'nivel' son obligatorios.",
    });
}

const facultadExists = facultades.some((facultad) => facultad.id === facultadId);

if (!facultadExists) {
    return res.status(404).json({
        statuscode: 404,
        success: false,
        message: "La facultad con id ${facultadId} no existe.",
    });
}

const newPrograma = {
    id: nextProgramaId++,
    codigo,
    facultadId,
    name,
    nivel,
    Createby: "system",
    CreateAt: new Date().toISOString(),
};

programas.push(newPrograma);

res.status(201).json({
    statuscode: 201,
    success: true,
    data: newPrograma,
});

const programas = [
    { id: 1, codigo: "is", facultadId: 1, name: "Ingeniería de Sistemas", nivel: "Pregrado", Createby: "system", CreateAt: new Date(). toISOString(), UpdateBy: "system", UpdateAt: new Date().toISOString() },
    { id: 2, codigo: "cc", facultadId: 1, name: "Contabilidad y Finanzas", nivel: "Pregrado", Createby: "system", CreateAt: new Date(). toISOString(), UpdateBy: "system", UpdateAt: new Date().toISOString() },
    { id: 3, codigo: "en", facultadId: 2, name: "Enfermería", nivel: "Pregrado", Createby: "system", CreateAt: new Date(). toISOString(), UpdateBy: "system", UpdateAt: new Date().toISOString() },
    { id: 4, codigo: "md", facultadId: 2, name: "Medicina", nivel: "Pregrado", Createby: "system", CreateAt: new Date(). toISOString(), UpdateBy: "system", UpdateAt: new Date().toISOString() },
]

let nextProgramaId = 5;

app.get("/api/facultades", (req, res) => {
    res.json({
        data: facultades,
        statuscode: 200
    });
});

app.get("/api/programas", (req, res) => {
    res.json({
        data: programas,
        statuscode: 200
    });
});

app.post("/api/programas/store", (req, res) => {
    console.log(req.body);
    res.json({
        statuscode: 201,
        success: true,
        recibido: req.body,
    });
});

app.listen(PORT, HOST, ()=> {
    console.log(APP_NAME);
    console.log(`Server is running on http://${HOST}:${PORT}`);
});