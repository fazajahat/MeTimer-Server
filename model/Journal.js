const { getDB } = require("../config/mongodb.config");

class Journal {
    static async create(title, content) {
        const { insertedId: journalId } = await getDB().collection("Journals").insertOne({ title, content });
        return journalId;
    }
}

module.exports = Journal;
