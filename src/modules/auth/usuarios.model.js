import mongoose from "mongoose";

const usuariosSchema = new mongoose.Schema({
  correo: { type: String, required: true, trim: true, lowercase: true, unique: true },
  password: { type: String, required: true, select: false },
  rol: { type: String, enum: ["admin", "estudiante"], required: true },
  estudiante: { type: mongoose.Schema.Types.ObjectId, ref: "Estudiantes", default: null }
},
{
  timestamps: true,
  versionKey: false
});

export default mongoose.model("Usuarios", usuariosSchema, "usuarios");
