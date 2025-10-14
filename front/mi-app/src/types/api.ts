// front/mi-app/src/types/api.ts

/** 🧍 Usuario base del sistema */
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "subscriber";
}

/** 🔐 Respuesta de autenticación (login / registro) */
export interface AuthResponse {
  token: string;
  user: User;
}

/** 🗂️ Proyecto retornado por el backend */
export interface Project {
  _id: string;
  title: string;
  subtitle?: string;
  category: string;
  content: string;
  imageUrl?: string;
  author: string;
  status: "draft" | "published";
  createdAt: string;
}

/** 📦 Payload para crear o editar un proyecto */
export interface ProjectPayload {
  title: string;
  subtitle?: string;
  category: string;
  content: string;
  imageUrl?: string;
  author: string;
  status: "draft" | "published";
}
