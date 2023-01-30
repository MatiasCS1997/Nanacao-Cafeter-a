const express = require("express");
const app = express();

const cafes = require("./cafes.json");

app.listen(3000, console.log("SERVER ON"));

app.use(express.json());

app.get("/cafes", (req, res) => {
  res.status(200).send(cafes);
});

app.get("/cafes/:id", (req, res) => {
  const { id } = req.params;
  const cafe = cafes.find((c) => c.id == id);
  if (cafe) res.status(200).send(cafe);
  else
    res.status(404).send({ message: "No se encontró ningún cafe con ese id" });
});

app.post("/cafes", (req, res) => {
  const cafe = req.body;
  const { id } = cafe;
  const existeUncafeConEseId = cafes.some((c) => c.id == id);
  if (existeUncafeConEseId)
    res.status(400).send({ message: "Ya existe un cafe con ese id" });
  else {
    cafes.push(cafe);
    res.status(201).send(cafes);
  }
});

app.put("/cafes/:id", (req, res) => {
  const cafe = req.body;
  const { id } = req.params;
  if (id !== cafe.id)
    return res.status(400).send({
      message: "El id del parámetro no coincide con el id del café recibido",
    });

  const cafeIndexFound = cafes.findIndex((p) => p.id == id);
  if (cafeIndexFound >= 0) {
    cafes[cafeIndexFound] = cafe;
    res.send(cafes);
  } else {
    res.status(404).send({ message: "No se encontró ningún café con ese id" });
  }
});

app.delete("/cafes/:id", (req, res) => {
  const jwt = req.header("Authorization");
  if (jwt) {
    const { id } = req.params;
    const cafeIndexFound = cafes.findIndex((c) => c.id == id);

    if (cafeIndexFound >= 0) {
      cafes.splice(cafeIndexFound, 1);
      console.log(cafeIndexFound, cafes);
      res.send(cafes);
    } else {
      res
        .status(404)
        .send({ message: "No se encontró ningún cafe con ese id" });
    }
  } else
    res
      .status(400)
      .send({ message: "No recibió ningún token en las cabeceras" });
});

app.use("*", (req, res) => {
  res.status(404).send({ message: "La ruta que intenta consultar no existe" });
});

module.exports = app;
