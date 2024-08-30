const dotenv = require("dotenv");
dotenv.config();
const express = require("express")
const app = express();
const esclient = require("./bin/elastic-client");
const client = require("./bin/MongoDB");

require('array.prototype.flatmap').shim()
path = require('path');


var database
const list = []

const cors = require("cors")
app.use(cors());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);


app.get("/", async (req, res) => {
    res.send("Hello Rest Api")

})
app.use("/amazon/bike", async (req, res) => {
    const amazonBike = require('./src/amazon/bike');
    console.log(amazonBike)
    res.set(path.join(__dirname + 'amazonBike'));
    database = await client.db("tyreplex").collection("amazon_biketyreCollection").find({}).toArray()


    database.forEach((data) => {
        list.push({
            data
        })
        return list;
    })
    // const items = database;



    const operations = list.flatMap(doc => [{ index: { _index: 'crawler' } }, doc])

    const bulkResponse = await esclient.bulk({ refresh: true, operations })

    if (bulkResponse.errors) {
        const erroredDocuments = []
        // The items array has the same order of the dataset we just indexed.
        // The presence of the `error` key indicates that the operation
        // that we did for the document has failed.
        bulkResponse.items.forEach((action, i) => {
            const operation = Object.keys(action)[0]
            if (action[operation].error) {
                erroredDocuments.push({
                    // If the status is 429 it means that you can retry the document,
                    // otherwise it's very likely a mapping error, and you should
                    // fix the document before to try it again.
                    status: action[operation].status,
                    error: action[operation].error,
                })
            }
        })
        console.log(erroredDocuments)
    }

    const count = await esclient.count({ index: 'crawler' })
    console.log(count)
    res.send(database)

})

app.use("/amazon/car", async (req, res) => {
    const amazonCar = require('./src/amazon/car');
    console.log(amazonCar)
    res.set(path.join(__dirname + 'amazonCar'));
    database = await client.db("tyreplex").collection("amazon_cartyreCollection").find({}).toArray()

    // const items = database;
    database.forEach((data) => {

        list.push({
            data
        })
        return list;
    })


    const operations = list.flatMap(doc => [{ index: { _index: 'crawler' } }, doc])

    const bulkResponse = await esclient.bulk({ refresh: true, operations })

    if (bulkResponse.errors) {
        const erroredDocuments = []
        // The items array has the same order of the dataset we just indexed.
        // The presence of the `error` key indicates that the operation
        // that we did for the document has failed.
        bulkResponse.items.forEach((action, i) => {
            const operation = Object.keys(action)[0]
            if (action[operation].error) {
                erroredDocuments.push({
                    // If the status is 429 it means that you can retry the document,
                    // otherwise it's very likely a mapping error, and you should
                    // fix the document before to try it again.
                    status: action[operation].status,
                    error: action[operation].error,
                })
            }
        })
        console.log(erroredDocuments)
    }

    const count = await esclient.count({ index: 'crawler' })
    console.log(count)
    res.send(database)
})
app.use("/flipkart/bike", async (req, res) => {
    const flipkartBike = require('./src/flipkart/bike');
    console.log(flipkartBike)
    res.set(path.join(__dirname + 'flipkartBike'));
    database = await client.db("tyreplex").collection("flipkart_biketyreCollection").find({}).toArray()
    

    // const items = database;
    database.forEach((data) => {

        list.push({
            data
        })
        return list;
    })


    const operations = list.flatMap(doc => [{ index: { _index: 'crawler' } }, doc])

    const bulkResponse = await esclient.bulk({ refresh: true, operations })

    if (bulkResponse.errors) {
        const erroredDocuments = []
        // The items array has the same order of the dataset we just indexed.
        // The presence of the `error` key indicates that the operation
        // that we did for the document has failed.
        bulkResponse.items.forEach((action, i) => {
            const operation = Object.keys(action)[0]
            if (action[operation].error) {
                erroredDocuments.push({
                    // If the status is 429 it means that you can retry the document,
                    // otherwise it's very likely a mapping error, and you should
                    // fix the document before to try it again.
                    status: action[operation].status,
                    error: action[operation].error,
                })
            }
        })
        console.log(erroredDocuments)
    }

    const count = await esclient.count({ index: 'crawler' })
    console.log(count)
    res.send(database)

})
app.use("/flipkart/car", async (req, res) => {
    const flipkartCar = require('./src/flipkart/car');
    console.log(flipkartCar)
    res.set(path.join(__dirname + 'flipkartCar'));
    database = await client.db("tyreplex").collection("flipkart_cartyreCollection").find({}).toArray()

    await esclient.indices.create({
        index: 'crawler',
        operations: {
            mappings: {
                properties: {
                    _id: {
                        type: 'text'
                    },
                    discount: {
                        type: 'string'
                    },
                    imglink: {
                        type: 'string'
                    },
                    numberOfRating: {
                        type: 'string'
                    },
                    price: {
                        type: 'string'
                    },
                    rating: {
                        type: 'string'
                    },
                    timeStamp: {
                        type: 'string'
                    },
                    url: {
                        type: 'string'
                    },
                }
            }
        }
    }, { ignore: [400] })


    // const items = database;
    database.forEach((data) => {

        list.push({
            data
        })
        return list;
    })


    const operations = list.flatMap(doc => [{ index: { _index: 'crawler' } }, doc])

    const bulkResponse = await esclient.bulk({ refresh: true, operations })

    if (bulkResponse.errors) {
        const erroredDocuments = []
        // The items array has the same order of the dataset we just indexed.
        // The presence of the `error` key indicates that the operation
        // that we did for the document has failed.
        bulkResponse.items.forEach((action, i) => {
            const operation = Object.keys(action)[0]
            if (action[operation].error) {
                erroredDocuments.push({
                    // If the status is 429 it means that you can retry the document,
                    // otherwise it's very likely a mapping error, and you should
                    // fix the document before to try it again.
                    status: action[operation].status,
                    error: action[operation].error,
                })
            }
        })
        console.log(erroredDocuments)
    }

    const count = await esclient.count({ index: 'crawler' })
    console.log(count)
    res.send(database)

})

app.listen(process.env.SERVER_PORT, () => console.info(`I will be shown on the port number ${process.env.SERVER_PORT} server port`))
