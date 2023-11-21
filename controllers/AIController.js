const { AI } = require("../model");

class AIController {
    static async generateQuote(req, res, next) {
        const { mood } = req.body;
        try {
            const quote = await AI.generateQuote(mood);
            res.status(200).json(quote);
        } catch (error) {
            console.log(error);
        }
    }

    static async journalResponse(req, res, next) {
        const { journal_content } = req.body;
        try {
            const journalResponse = await AI.journalResponse(journal_content);
            res.status(200).json({ response: journalResponse });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = AIController;
