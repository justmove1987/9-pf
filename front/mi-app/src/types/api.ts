// front/mi-app/src/types/api.ts

/** Usuari retornat pel backend */
export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "subscriber";
}

/** Resposta del login */
export interface LoginResponse {
  token: string;
  user: ApiUser;
}

/** Resposta del registre */
export interface RegisterResponse {
  token: string;
  user: ApiUser;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "subscriber";
}

/** Projecte retornat pel backend */
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
