import mongoose from "mongoose";

const programasSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 150
  },
  facultad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Facultades",
    required: true
  },
},
{
  timestamps: true,
  versionKey: false
}
);

export default mongoose.model("Programas", programasSchema, "programas");
