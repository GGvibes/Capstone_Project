const express = require("express");
const usersRouter = express.Router();
const bcrypt = require("bcrypt");
const { createUser, getAllUsers, getUserByEmail, getUserById } = require("../db/index.cjs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { requireUser }= require("./utils")

console.log("Loaded JWT_SECRET:", process.env.JWT_SECRET);

usersRouter.get("/me",requireUser, async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await getAllUsers();

    res.send({
      users,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

usersRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  // request must have both
  if (!email || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both an email and password",
    });
  }

  try {
    const user = await getUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        {
          id: user.id,
          email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );

      res.send({
        message: "you're logged in!",
        token,
      });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Email or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.post("/signup", async (req, res, next) => {
  const { firstName, lastName, email, password, address } = req.body;
  console.log("Request body:", req.body); 

  try {
    const user = await createUser({ firstName, lastName, email, password, address });

    if (!user) {
      console.log("User creation failed");
      return res.status(400).send({ message: "User creation failed" });
    }

    console.log("User created:", user);

    console.log("JWT_SECRET before signing:", process.env.JWT_SECRET);
    console.log("User ID:", user.id, "Email:", user.email);

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing before token generation");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1w" }
    );

    console.log("Generated token:", token);

    res.status(201).send({ message: "Thank you for signing up", token });
  } catch (error) {
    console.error("Error during user signup or token generation:", error);
    res.status(500).send({ message: "Error generating token or creating user" });
  }
});


module.exports = usersRouter;
