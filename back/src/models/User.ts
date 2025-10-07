import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "editor" | "subscriber";
  active: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "editor", "subscriber"],
      default: "subscriber",
    },
    active: {
      type: Boolean,
      default: true, // per defecte, actiu
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
