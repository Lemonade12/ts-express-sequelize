require("dotenv").config();
import express, { Request, Response } from "express";

const routes = require("./src/routes/index");

const app = express();
const db = require("./database/index");

db.sequelize
  .sync({ alter: true, force: true })
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);

// simple route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to my application." });
});

app.use(routes);

// set port, listen for requests
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}!`);
});
