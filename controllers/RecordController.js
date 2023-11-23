const Record = require("../model/Record");

class RecordController {
  static async createRecord(req, res, next) {
      const data = req.body;
      const { id } = req.user;
      const response = await Record.create(data, id);
      res.status(201).json(response);
  }

  static async getRecords(req, res, next) {
    const { id } = req.user;
      const records = await Record.findAll(id);
      res.json(records);
  }
  static async getRecordById(req, res, next) {
    const { recordId } = req.params;
      const record = await Record.findById(recordId);
      res.send(record);
  }
}

module.exports = RecordController;
