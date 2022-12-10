require("dotenv").config();
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import socket from "./socket";

const routes = require("./src/routes/index");

const app = express();
const db = require("./database/index");
const http = require("http");

db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);

const redisClient = require("./database/redis");
redisClient.connect().then();

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to my application." });
});

app.use(routes);

const server = http.createServer(app);

// set port, listen for requests
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}!`);
});

socket(server);
