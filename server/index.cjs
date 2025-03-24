require('dotenv').config();

const  PORT  = process.env.PORT || 5000;
const express = require('express');
const server = express();
const path = require('path')
const cors = require('cors');
const usersRouter = require('./api/users.cjs')
const animalsRouter = require('./api/animals.cjs')
const reservationsRouter = require('./api/reservations.cjs')

server.use(cors({
  origin: process.env.FRONTEND_URL,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}))

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const morgan = require('morgan');
server.use(morgan('dev'));

server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});

server.get("/test", (req, res)=> {
  res.json({message: "test API route"})
})

const apiRouter = require('./api/index.cjs');
server.use('/api', apiRouter);

server.use("/api/animals", animalsRouter)
server.use("/api/users", usersRouter)
server.use("/api/reservations", reservationsRouter)


const { client } = require('./db/index.cjs');
client.connect();

server.listen(PORT, () => {
  console.log("The server is up on port", PORT);
});