const { ObjectId } = require("mongodb");
const { getDB } = require("../config/mongodb.config");

class Journal {
    static async create(title, content) {
            const { insertedId: journalId } = await getDB().collection("Journals").insertOne({ title, content });
            return journalId;
}

    static async findById(id) {
            const journal = await getDB()
                .collection("Journals")
                .findOne({ _id: new ObjectId(id) });
            return journal;
    }
}

module.exports = Journal;
