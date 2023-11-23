const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/";

const client = new MongoClient(uri);

let database = {};

async function connectDB() {
    try {
        await client.connect();
        database = client.db("MeTimer");
        return database;
    } catch (err) {
    }
}

function getDB() {
    return database;
}

module.exports = { connectDB, getDB };
