require("dotenv").config();
import express, { Request, Response } from "express";
import socket from "./socket";
import path from "path";
const morgan = require("morgan");

console.log(path.dirname(__filename));

const routes = require("./src/routes/index");

const app = express();
const db = require("./database/index");
const http = require("http");
/*const { Client } = require("elasticsearch");
const client = new Client({
  host: "https://localhost:9200",
  log: "trace",
});*/

db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);

const redisClient = require("./database/redis");
redisClient.connect().then();

app.use(morgan("dev"));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to my application." });
});
app.use("/css", express.static("./static/css"));
app.use("/js", express.static("./static/js"));
app.use(routes);

const server = http.createServer(app);

// set port, listen for requests
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}!`);
});
socket(server);
module.exports = server;
