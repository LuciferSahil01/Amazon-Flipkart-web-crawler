const dotenv = require("dotenv");
dotenv.config();
const { Client } = require("@elastic/elasticsearch");
const fs = require('fs');


const esClient = new Client({
    node: process.env.URI_ELASTICSEARCH_SERVER,
  auth: {
    username: process.env.ES_USERNAME,
    password: process.env.ES_PASSWORD,
  },
  tls: {
    ca: fs.readFileSync(process.env.TLS_PATH),
    rejectUnauthorized: false
}
});

// const main = async () => {
//     const health = await esClient.cluster.health();
//     console.log(health)
//   }
//   main()

module.exports = esClient;