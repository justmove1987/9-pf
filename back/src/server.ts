// src/server.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./utils/server.ts";

dotenv.config();

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => {
    console.log("✅ MongoDB connectat");
    if (process.env.NODE_ENV !== "test") {
      app.listen(PORT, () => {
        console.log(`🚀 Servidor escoltant al port ${PORT}`);
      });
    }
  })
  .catch((err) => console.error("❌ Error connectant MongoDB:", err));

export default app;
