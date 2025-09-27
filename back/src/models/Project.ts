import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  author: string;         // Nombre visible del autor
  description?: string;   // Resumen corto (opcional)
  content: string;        // ✅ Contenido HTML del editor enriquecido
  imageUrl?: string;      // Imagen de portada o de cabecera
  url?: string;           // Enlace externo si lo necesitas
  createdBy: string;      // ✅ ID del usuario creador
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });


export default mongoose.model<IProject>("Project", ProjectSchema);

