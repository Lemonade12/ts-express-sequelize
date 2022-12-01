import { createClient } from "redis";
const redisClient = createClient();

redisClient.on("connect", function () {
  console.log("Redis Database connected");
});

redisClient.on("reconnecting", function () {
  console.log("Redis client reconnecting");
});

redisClient.on("ready", function () {
  console.log("Redis client is ready");
});

redisClient.on("error", function (err) {
  console.log("Something went wrong " + err);
});

redisClient.on("end", function () {
  console.log("\nRedis client disconnected");
  console.log("Server is going down now...");
  process.exit();
});

module.exports = redisClient;
