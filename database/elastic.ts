/*const { Client } = require("elasticsearch");
const esClient = new Client({
  host: "https://localhost:9200",
  //host: "https://elastic:elastic@localhost:9200",
  log: "trace",
});*/
const { Client } = require("@elastic/elasticsearch");
const esClient = new Client({
  node: "https://localhost:9200",
  auth: {
    username: "elastic",
    password: "elastic",
  },
  tls: { rejectUnauthorized: false },
  log: "trace",
});
esClient.info().then(console.log);
module.exports = esClient;
