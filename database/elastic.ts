const { Client } = require("elasticsearch");
const esClient = new Client({
  host: "https://elastic:elastic@localhost:9200",
  log: "trace",
});

module.exports = esClient;
