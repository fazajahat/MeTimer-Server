const { ObjectId } = require("mongodb");
const { getDB } = require("../config/mongodb.config");
const Journal = require("./Journal");

class Record {
    static async create(data, userId) {
        const { rateMood, moods, title, content } = data;
            const journalId = await Journal.create(title, content);
            const record = await getDB()
                  .collection("Records")
                .insertOne({ rateMood, moods, journalId: new ObjectId(journalId), date: new Date(), userId: new ObjectId(userId) });
            return record;
    }

    static async findAll(id) {
            const records = await getDB()
                .collection("Records")
                .aggregate([
                    {
                        $match: {
                            userId: new ObjectId(id)
                        }
                    },
                    {
                        $lookup: {
                            from: "Journals",
                            localField: "journalId",
                            foreignField: "_id",
                            as: "Journal"
                        }
                    },
                    {
                        $sort: {
                            date: -1
                        }
                    }
                ]);
            return await records.toArray();
    }

    static async findById(recordId) {
            const record = await getDB()
                .collection("Records")
                .findOne({ _id: new ObjectId(recordId) });

            const journal = await Journal.findById(record.journalId);
            record.Journal = journal;
            return record;
    }
}

module.exports = Record;
