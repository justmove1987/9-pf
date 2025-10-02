// src/models/Project.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProject extends Document {
  title: string;
  subtitle?: string;
  category: "Paper" | "Digital" | "Editorial"; // ✅ fem required
  content: string;
  imageUrl?: string;
  author: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  status: "published" | "draft";
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    category: {
      type: String,
      enum: ["Paper", "Digital", "Editorial"],
      required: true,
    },
    content: { type: String, required: true },
    imageUrl: { type: String },
    author: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "draft",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProject>("Project", ProjectSchema);
