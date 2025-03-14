const express = require("express");
const reservationsRouter = express.Router();
const {
  getAllReservations,
  getReservationById,
  createReservation,
  getReservationsByUser,
  getReservationsByAnimal,
  editReservation
} = require("../db/index.cjs");
const { requireUser }= require("./utils")
require("dotenv").config();

reservationsRouter.get("/", requireUser, async (req, res, next) => {
  try {
    const animals = await getAllReservations();
    res.send({
      animals,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

reservationsRouter.get("/lookupbyuser/:user_id",requireUser, async (req, res, next) => {
    try {
      const reservations = await getReservationsByUser(req.params.user_id);
      res.json(reservations);
    } catch (error) {
      next(error);
    }
  });

  reservationsRouter.get("/lookupbyanimal/:animal_id", requireUser, async (req, res, next) => {
    try {
      const reservations = await getReservationsByAnimal(req.params.animal_id);
      res.json(reservations);
    } catch (error) {
      next(error);
    }
  });
  
  reservationsRouter.put("/:id", requireUser, async (req, res, next) => {
    const { id } = req.params;
    const fields = req.body;

    try {
      const updatedReservation = await editReservation(id, fields);
      if (!updatedReservation) {
        return res.status(404).json({ message: 'Reservation not found' });
      }
      res.json(updatedReservation);
    } catch (error) {
      console.error("error updating reservation", error);
      res.status(500).json({ message: 'Failed to update reservation' });
    }
  });

reservationsRouter.get("/:id",requireUser, async (req, res, next) => {
  try {
    const reservation = await getReservationById(req.params.id);
    res.json(reservation);
  } catch (error) {
    next(error);
  }
});

reservationsRouter.post("/", requireUser, async (req, res, next) => {
  const { user_id, animal_id, start_date, end_date } = req.body;

  if (!user_id || !animal_id || !start_date || !end_date) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (new Date(start_date) >= new Date(end_date)) {
    return res
      .status(400)
      .json({ error: "Start date must be before end date" });
  }
  try {
    const reservation = await createReservation({
      user_id,
      animal_id,
      start_date,
      end_date,
    });

    res.status(201).send({
      message: "Reservation created",
      reservation,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = reservationsRouter;
