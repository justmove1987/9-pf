import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../utils/server";
import User from "../models/User";

jest.setTimeout(50000); // ⏱️ Més marge per a operacions async

let mongo: MongoMemoryServer;
let adminToken = "";

/* ----------------------------------------------------------
   🧩 ABANS DE TOTS ELS TESTS: arrenca Mongo en memòria
---------------------------------------------------------- */
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);

  // Crear un usuari admin directament a la BD de test
  await User.create({
    name: "Admin Test",
    email: "admin@test.com",
    password: "hashed",
    role: "admin",
  });

  // Simulem un token JWT vàlid (pots adaptar segons el teu backend)
  adminToken =
    "Bearer " +
    require("jsonwebtoken").sign(
      { id: "fakeId", name: "Admin Test", role: "admin" },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );
});

/* ----------------------------------------------------------
   🧹 DESPRÉS DE TOTS ELS TESTS: tanca i neteja
---------------------------------------------------------- */
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});

/* ----------------------------------------------------------
   🧪 TESTS
---------------------------------------------------------- */

describe("Admin Routes", () => {
  it("hauria de registrar un nou usuari", async () => {
    const res = await request(app)
      .post("/admin/register")
      .send({
        name: "Usuari Prova",
        email: "usuari@prova.com",
        password: "123456",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toHaveProperty("email", "usuari@prova.com");
  });

  it("hauria de retornar tots els usuaris (admin)", async () => {
    const res = await request(app)
      .get("/admin/users")
      .set("Authorization", adminToken);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("hauria de eliminar un usuari existent", async () => {
    const newUser = await User.create({
      name: "Usuari a esborrar",
      email: "delete@prova.com",
      password: "hashed",
      role: "editor",
    });

    const res = await request(app)
      .delete(`/admin/users/${newUser._id}`)
      .set("Authorization", adminToken);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
  });
});
