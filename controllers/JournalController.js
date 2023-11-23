const Journal = require("../model/Journal");

class JournalController {
  static async findById(req, res, next) {
    const { id } = req.params;
      const journal = await Journal.findById(id);
      res.json(journal);
  }
}

module.exports = JournalController;
