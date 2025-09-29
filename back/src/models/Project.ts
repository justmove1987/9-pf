import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProject extends Document {
  title: string;
  subtitle?: string;
  category?: "Paper" | "Digital" | "Editorial";
  content: string;
  imageUrl?: string;
  author: string;
  createdBy: Types.ObjectId;   // ✅ Usa Types.ObjectId, no string
  createdAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    category: { type: String, enum: ["Paper", "Digital", "Editorial"] },
    content: { type: String, required: true },
    imageUrl: { type: String },
    author: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true }, // ✅ correcte
  },
  { timestamps: true }
);

export default mongoose.model<IProject>("Project", ProjectSchema);
