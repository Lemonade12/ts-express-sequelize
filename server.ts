require("dotenv").config();
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import socket from "./socket";

const routes = require("./src/routes/index");

const app = express();
const fs = require("fs");
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
app.use("/css", express.static("./static/css"));
app.use("/js", express.static("./static/js"));

app.get("/chat", function (request, response) {
  fs.readFile("./static/index.html", function (err: any, data: any) {
    if (err) {
      response.send("에러");
    } else {
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(data);
      response.end();
    }
  });
});

const server = http.createServer(app);

// set port, listen for requests
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}!`);
});

socket(server);
