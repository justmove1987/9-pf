export async function uploadFile(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch("http://localhost:3000/uploads", {
    method: "POST",
    body: form,
  });

  if (!res.ok) throw new Error("Error pujant el fitxer");

  const data = await res.json();
  return data.url;
}