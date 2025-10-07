import type { Project } from "../types/api";
import { fetchWithValidation } from "../utils/fetchWithValidation";

/**
 * 📦 Obté tots els projectes
 */
export const getProjects = async (): Promise<Project[]> => {
  return await fetchWithValidation<Project[]>("http://localhost:3000/projects");
};

/**
 * 🧩 Dades necessàries per crear o editar un projecte
 */
export interface ProjectPayload {
  title: string;
  subtitle?: string;
  category: string;
  content: string;
  imageUrl?: string;
  author: string;
  status: "draft" | "published";
}

/**
 * 🧱 Crea un nou projecte
 */
export const createProject = async (
  data: ProjectPayload,
  token: string
): Promise<Project> => {
  return await fetchWithValidation<Project>("http://localhost:3000/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
};

/**
 * 🧰 Actualitza un projecte existent
 */
export const updateProject = async (
  id: string,
  data: ProjectPayload,
  token: string
): Promise<Project> => {
  return await fetchWithValidation<Project>(
    `http://localhost:3000/projects/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );
};

/**
 * 🗑️ Elimina un projecte
 */
export const deleteProject = async (
  id: string,
  token: string
): Promise<void> => {
  await fetchWithValidation<void>(`http://localhost:3000/projects/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
