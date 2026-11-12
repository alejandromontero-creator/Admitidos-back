import mongoose from "mongoose";

const estudiantesSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  apellido: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  documento: { type: String, required: true, trim: true, unique: true },
  correo: { type: String, required: true, trim: true, lowercase: true, unique: true },
  programa: { type: mongoose.Schema.Types.ObjectId, ref: "Programas", required: true },
  estado: { type: String, enum: ["admitido", "pendiente", "rechazado"], default: "pendiente" }
},
{
  timestamps: true,
  versionKey: false
});

export default mongoose.model("Estudiantes", estudiantesSchema, "estudiantes");