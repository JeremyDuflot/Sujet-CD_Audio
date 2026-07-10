const request = require("supertest");
const express = require("express");
const cors = require("cors");
const cdRoutes = require("../../Routes/cdRoutes");
const pool = require("../../configs/db");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", cdRoutes);

describe("Tests d'intégration - API CD ↔ Base de données", () => {
  let createdId;

  beforeAll(async () => {
    await pool.query("DELETE FROM cds WHERE title = $1", ["CD Test Intégration"]);
  });

  afterAll(async () => {
    await pool.query("DELETE FROM cds WHERE title = $1", ["CD Test Intégration"]);
    await pool.end();
  });

  test("POST /api/cds ajoute un CD en base de données", async () => {
    const res = await request(app)
      .post("/api/cds")
      .send({ title: "CD Test Intégration", artist: "Artiste Test", year: 2024 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe("CD Test Intégration");

    createdId = res.body.id;

    const dbCheck = await pool.query("SELECT * FROM cds WHERE id = $1", [createdId]);
    expect(dbCheck.rows).toHaveLength(1);
    expect(dbCheck.rows[0].artist).toBe("Artiste Test");
  });

  test("GET /api/cds renvoie la liste des CD incluant celui ajouté", async () => {
    const res = await request(app).get("/api/cds");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const found = res.body.find((cd) => cd.id === createdId);
    expect(found).toBeDefined();
    expect(found.title).toBe("CD Test Intégration");
  });

  test("DELETE /api/cds/:id supprime le CD de la base de données", async () => {
    const res = await request(app).delete(`/api/cds/${createdId}`);

    expect(res.status).toBe(204);

    const dbCheck = await pool.query("SELECT * FROM cds WHERE id = $1", [createdId]);
    expect(dbCheck.rows).toHaveLength(0);
  });
});