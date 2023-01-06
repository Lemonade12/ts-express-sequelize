import express from "express";
import * as fs from "fs";
const authMiddleware = require("../modules/auth");

const router = express.Router();

router.get("/chat", authMiddleware.auth, function (request, response) {
  fs.readFile("./static/index.html", function (err, data) {
    if (err) {
      response.send(err);
      response.send("에러");
    } else {
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(data);
      response.end();
    }
  });
});

module.exports = router;
