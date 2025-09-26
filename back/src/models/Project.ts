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

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    content: { type: String, required: true },      // Campo nuevo para el cuerpo del post
    imageUrl: { type: String },
    url: { type: String },
    createdBy: { type: String, required: true },    // Guarda el _id del usuario creador
  },
  { timestamps: true }
);

export default mongoose.model<IProject>("Project", ProjectSchema);

