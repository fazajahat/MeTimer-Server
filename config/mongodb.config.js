const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);

let database = {};

async function connectDB() {
    try {
        await client.connect();
        database = client.db("MeTimer");
        console.log("Database connected successfully");
        return database;
    } catch (err) {
        console.log("Error connecting to database", err);
    }
}

function getDB() {
    return database;
}

module.exports = { connectDB, getDB };
