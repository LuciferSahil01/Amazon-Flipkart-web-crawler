const elasticsearch = require('elasticsearch');
const MongoClient = require('mongodb').MongoClient;
const River = require('mongo-river-elastic');

// Connect Mongodb
MongoClient.connect('localhost:27017', function (err, mongoClient) {
    const _mongo_db_ref = mongoClient.db('tyreplex');

    // connect elasticsearch
    const _es_ref = new elasticsearch.Client({host: 'localhost:9200'});

    // init River
    const _collection_index_dict = {
    'collection1': {index: 'index1', type: 'type1', primaryKeyField: '_id'},
    'collection2': {index: 'index2', type: 'type2', primaryKeyField: 'uuid'}
    };
    const options= {logLevel: 'debug', retryCount: 3};
    let river = new River(_mongo_db_ref, _es_ref, _collection_index_dict, options);
})