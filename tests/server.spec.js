const supertest = require("supertest");
const server = require("../index");
const request = supertest(server);

describe("Operaciones CRUD de cafes", () => {
  it("deberia retornar status 200 y al menos 1 arreglo", async () => {
    const response = await request.get("/cafes");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(1);
  });

  it("deberia retornar un status 404 al eliminar un cafe que no existe", async () => {
    const response = await request
      .delete("/cafes/123")
      .set({ Authorization: "test" });

    expect(response.status).toBe(404);
  });

  it("deberia agregar un nuevo cafe y retornar startus 201", async () => {
    const response = await request
      .post("/cafes")
      .send({ id: 5, nombre: "vainilla" });

    expect(response.status).toBe(201);
  });

  it("deberia retornar un status 400 al intentar actualizar un cafe con el id de la ruta distinto al payload", async () => {
    const response = await request
      .put("/cafes/1")
      .send({ id: 5, nombre: "vainilla" });

    expect(response.status).toBe(400);
  });
});
