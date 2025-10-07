import request from "supertest";
import app from "../utils/server";

describe("Servidor Express", () => {
  it("hauria de respondre a GET / amb un missatge", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toContain("Servidor Express");
  });
});
