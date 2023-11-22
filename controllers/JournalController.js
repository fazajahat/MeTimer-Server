const Journal = require("../model/Journal");

class JournalController {
  static async findById(req, res, next) {
    const { id } = req.params;
    try {
      const journal = await Journal.findById(id);
      res.json(journal);
    } catch (error) {
      console.log(error);
    }
  }

  static async deleteJournal(req, res, next) {
    const journal = await Journal.destroyAll();
    res.json(journal);
  }
}

module.exports = JournalController;
