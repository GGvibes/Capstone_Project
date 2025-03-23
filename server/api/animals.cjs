const express = require("express");
const animalsRouter = express.Router();
const { getAllAnimals, getAnimalById } = require("../db/index.cjs");
require("dotenv").config();

animalsRouter.get("/", async (req, res, next) => {
  try {
    const animals = await getAllAnimals();
    res.send({
      animals,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

animalsRouter.get("/:id", async (req, res, next) => {
    try {
      const animal = await getAnimalById(req.params.id);
      res.json(animal);
    } catch (error) {
      next(error);
    }
  });


module.exports = animalsRouter;
