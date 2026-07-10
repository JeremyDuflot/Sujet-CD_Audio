jest.mock("../../configs/db");
const pool = require("../../configs/db");
const { getAllCDs, addCD, deleteCD } = require("../cdController");

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

describe("cdController - tests unitaires", () => {
  afterEach(() => jest.clearAllMocks());

  test("getAllCDs renvoie la liste des CD", async () => {
    const fakeCDs = [{ id: 1, title: "Divide", artist: "Ed Sheeran", year: 2017 }];
    pool.query.mockResolvedValue({ rows: fakeCDs });

    const req = {};
    const res = mockRes();

    await getAllCDs(req, res);

    expect(pool.query).toHaveBeenCalledWith("SELECT * FROM cds ORDER BY id ASC");
    expect(res.json).toHaveBeenCalledWith(fakeCDs);
  });

  test("getAllCDs renvoie une erreur 500 en cas d'échec DB", async () => {
    pool.query.mockRejectedValue(new Error("DB error"));
    const req = {};
    const res = mockRes();

    await getAllCDs(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
  });

  test("addCD insère un CD et renvoie 201", async () => {
    const newCD = { id: 2, title: "Test", artist: "Artist", year: 2023 };
    pool.query.mockResolvedValue({ rows: [newCD] });

    const req = { body: { title: "Test", artist: "Artist", year: 2023 } };
    const res = mockRes();

    await addCD(req, res);

    expect(pool.query).toHaveBeenCalledWith(
      "INSERT INTO cds (title, artist, year) VALUES ($1, $2, $3) RETURNING *",
      ["Test", "Artist", 2023]
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(newCD);
  });

  test("addCD renvoie une erreur 500 en cas d'échec", async () => {
    pool.query.mockRejectedValue(new Error("Insert failed"));
    const req = { body: { title: "X", artist: "Y", year: 2020 } };
    const res = mockRes();

    await addCD(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("deleteCD supprime un CD et renvoie 204", async () => {
    pool.query.mockResolvedValue({});
    const req = { params: { id: "1" } };
    const res = mockRes();

    await deleteCD(req, res);

    expect(pool.query).toHaveBeenCalledWith("DELETE FROM cds WHERE id = $1", ["1"]);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});