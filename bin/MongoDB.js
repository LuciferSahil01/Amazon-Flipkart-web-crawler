const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.URI_MONGODB_SERVER);
client.connect().then(() => console.log("Connected to MongoDB"));

module.exports = client;