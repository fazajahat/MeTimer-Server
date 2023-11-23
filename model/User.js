const { ObjectId } = require("mongodb");
const getDB = require("../config/mongodb.config").getDB;

class User {
    static async findByPk(id) {
        return await getDB()
            .collection("Users")
            .findOne({ _id: new ObjectId(id) });
    }

    static async findByEmail(email) {
        return await getDB().collection("Users").findOne({ email });
    }

    static async findById(id) {
        return await getDB()
            .collection("Users")
            .findOne({ _id: new ObjectId(id) });
    }

    static async findOrCreate(email, data) {
            const result = await getDB().collection("Users").findOneAndUpdate(
                { email }, // find a document with that email OR username
                { $setOnInsert: data }, // use $setOnInsert operator to insert data only on creation
                { upsert: true, returnOriginal: false }
            );

            // INTINYA: Kalo user udh ada, return bakalan null. maka dari itu di find lagi biar bisa return id nya
            // Kalo belum ada, return nya bakal object user nya yg ketemu, maka aku return 0
            // Biar kyk sequelize
            if (result === null) {
                const newUser = await getDB().collection("Users").findOne({ email });
                return newUser._id;
            } else {
                return 0;
            }
    }
}

module.exports = User;
