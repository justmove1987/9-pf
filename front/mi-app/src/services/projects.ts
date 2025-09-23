export const getProjects = async () =>
  fetch("/api/projects").then(r => r.json());

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createProject = async (data:any, token:string) =>
  fetch("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
