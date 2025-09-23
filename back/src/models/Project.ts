import mongoose from "mongoose";
const ProjectSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
  imageUrl: String,
  url: String,
}, { timestamps: true });
export default mongoose.model("Project", ProjectSchema);
