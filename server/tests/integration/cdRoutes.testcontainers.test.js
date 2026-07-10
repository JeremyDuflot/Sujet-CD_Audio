const request = require("supertest");
const express = require("express");
const cors = require("cors");
const { PostgreSqlContainer } = require("@testcontainers/postgresql");
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

let container;
let pool;
let app;

describe("Tests d'intégration avec Testcontainers (DB isolée)", () => {
  let createdId;

  beforeAll(async () => {
    container = await new PostgreSqlContainer("postgres:16")
      .withDatabase("cd_database")
      .withUsername("user")
      .withPassword("password")
      .start();

    pool = new Pool({
      host: container.getHost(),
      port: container.getMappedPort(5432),
      user: "user",
      password: "password",
      database: "cd_database",
    });

    // Créer la table (car pas d'import.sql automatique ici)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cds (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        artist VARCHAR(255) NOT NULL,
        year INTEGER NOT NULL
      );
    `);

    // Recréer une petite app Express isolée, branchée sur ce pool de test
    jest.resetModules();
    jest.doMock("../../configs/db", () => pool);
    const cdRoutes = require("../../Routes/cdRoutes");

    app = express();
    app.use(cors());
    app.use(express.json());
    app.use("/api", cdRoutes);
  }, 60000);

  afterAll(async () => {
    await pool.end();
    await container.stop();
  });

  test("POST /api/cds ajoute un CD dans le conteneur isolé", async () => {
    const res = await request(app)
      .post("/api/cds")
      .send({ title: "CD Testcontainers", artist: "Artiste Isolé", year: 2024 });

    expect(res.status).toBe(201);
    createdId = res.body.id;

    const dbCheck = await pool.query("SELECT * FROM cds WHERE id = $1", [createdId]);
    expect(dbCheck.rows).toHaveLength(1);
  });

  test("GET /api/cds renvoie le CD ajouté", async () => {
    const res = await request(app).get("/api/cds");
    const found = res.body.find((cd) => cd.id === createdId);
    expect(found).toBeDefined();
  });

  test("DELETE /api/cds/:id supprime le CD", async () => {
    const res = await request(app).delete(`/api/cds/${createdId}`);
    expect(res.status).toBe(204);

    const dbCheck = await pool.query("SELECT * FROM cds WHERE id = $1", [createdId]);
    expect(dbCheck.rows).toHaveLength(0);
  });
});